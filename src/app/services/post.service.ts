import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of, combineLatest } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  editingPost: any;
  postsCache: any = {};

  constructor(
    private afStore: AngularFirestore,
    private userService: UserService,
    private storage: AngularFireStorage,
    private auth: AuthService
  ) {}

  getRecentPosts(limit: number = 4) {
    return this.afStore
      .collection('posts', ref => ref.orderBy('createdTimestamp', 'desc').limit(limit))
      .valueChanges({ idField: 'postId' })
      .pipe(
        map(posts => {
          return posts.map((post: any) => {
            const thumbnail = post.thumbnailPath ? this.getPostThumbnail(post.thumbnailPath, post.thumbnailImgUrl) : undefined;
            return { ...post, thumbnail };
          });
        })
      );
  }

  getSortedPosts(sortField: string = 'createdTimestamp') {
    if (this.postsCache[sortField]) return of(this.postsCache[sortField]);

    return this.afStore
      .collection('posts', ref => ref.orderBy(sortField, 'desc').limit(20))
      .valueChanges({ idField: 'postId' })
      .pipe(
        map(posts => {
          return posts.map((post: any) => {
            const thumbnail = post.thumbnailPath ? this.getPostThumbnail(post.thumbnailPath, post.thumbnailImgUrl) : undefined;
            return { ...post, thumbnail };
          });
        }),
        tap(posts => this.postsCache[sortField] = [...posts])
      );
  }

  getPostsByCategoryNEW(category: string) {
    if (this.postsCache[category]) return of(this.postsCache[category]);

    return this.afStore
      .collection('posts', ref => ref.where('category', '==', category))
      .valueChanges({ idField: 'postId' })
      .pipe(
        map(posts => {
          return posts.map((post: any) => {
            const thumbnail = post.thumbnailPath ? this.getPostThumbnail(post.thumbnailPath, post.thumbnailImgUrl) : undefined;
            return { ...post, thumbnail };
          });
        }),
        tap(posts => this.postsCache[category] = [...posts])
      );
  }

  searchPosts(term: string = '') {
    return combineLatest([this.getPostsByTitle(term), this.getPostsByTag(term)])
      .pipe(
        map(([titlePosts, tagPosts]) => {
          const both = [...titlePosts];
          tagPosts.forEach(tagPost => {
            if (!titlePosts.some(titlePost => titlePost.postId === tagPost.postId)) {
              both.push(tagPost);
            }
          });
          return both;
        }),
        map(posts => {
          return posts.map((post: any) => {
            const thumbnail = post.thumbnailPath ? this.getPostThumbnail(post.thumbnailPath, post.thumbnailImgUrl) : undefined;
            return { ...post, thumbnail };
          });
        })
      );
  }

  getPostsByTitle(title: string) {
    return this.afStore
      .collection('posts', ref => ref
        .where('lowerCaseTitle', '>=', title.toLowerCase())
        .where('lowerCaseTitle', '<=', title.toLowerCase() + 'z'))
      .valueChanges({ idField: 'postId' });
  }

  getPostsByTag(tag: string) {
    return this.afStore
      .collection('posts', ref => ref.where('tags', 'array-contains', tag))
      .valueChanges({ idField: 'postId' });
  }

  getPostThumbnail(path: string, backupUrl: string): Observable<any> {
    return this.storage
      .ref(path)
      .getDownloadURL()
      .pipe(
        catchError(e => {
          console.log('postThumbnail not found', e);
          return of(backupUrl);
        })
      );
  }

  getUserPosts(uid: string, limit: number = 20): Observable<any> {
    return this.afStore
      .collection('posts', ref => ref.where('userId', '==', uid).orderBy('createdTimestamp', 'desc').limit(limit))
      .valueChanges({ idField: 'postId' })
      .pipe(
        map(posts => {
          return posts.map((post: any) => {
            const thumbnail = post.thumbnailPath ? this.getPostThumbnail(post.thumbnailPath, post.thumbnailImgUrl) : undefined;
            return { ...post, thumbnail };
          });
        })
      );
  }

  getPost(postId: string): Observable<any> {
    return this.afStore
      .doc(`posts/${postId}`)
      .valueChanges()
      .pipe(
        switchMap((post: any) => {
          if (!post) {
            return of(null);
          }

          return this.afStore
            .doc(`users/${post.userId}`)
            .get()
            .pipe(
              map(user => user.data()),
              map(user => {
                const thumbnail = this.userService.getUserThumbnail(user, 100);

                return { ...user, thumbnail };
              }),
              switchMap(user => of({ ...post, postId, user }))
            );
        })
      );
  }

  createPost(post: any) {
    return this.afStore
      .collection('posts')
      .add(post);
  }

  updatePost(doc: string, post: any) {
    return this.afStore
      .collection('posts')
      .doc(doc)
      .update(post);
  }

  deletePost(doc: string) {
    return this.afStore
      .collection('posts')
      .doc(doc)
      .delete();
  }

  async savePostImages(images: any[], thumbnailIndex: number = 0) {
    const { uid } = await this.auth.getCurrentUser();

    const postImages = [];

    for await (let img of images) {
      if (!img.file && img.url) {
        postImages.push(img);
      } else {
        const fileType = img.file.type.split('/')[1];
        const random = Math.random().toString().slice(3, 9);
        const path = `deli-pictures/${uid.substring(0, 10)}-${random}.${fileType}`;
        const metadata = { customMetadata: { userId: uid } };

        const ref = this.storage.ref(path);
        await this.storage.upload(path, img.file, metadata);
        const url = await ref.getDownloadURL().toPromise();

        const thumbnailPathBase = `deli-pictures/thumbnails/${uid.substring(0, 10)}-${random}`;
        const thumbPath = `${thumbnailPathBase}_500x500.${fileType}`;

        postImages.push({ url, thumbPath, thumbnailPathBase, path, fileType });
      }
    }

    const postObj = {
      images: postImages,
      thumbnailPath: postImages[thumbnailIndex].thumbPath,
      thumbnailImgUrl: postImages[thumbnailIndex].url,
      userId: uid
    };

    return postObj;
  }
}
