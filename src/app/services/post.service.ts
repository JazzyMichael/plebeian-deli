import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts$: BehaviorSubject<any>;
  featuredPosts$: BehaviorSubject<any>;
  editingPost: any;

  deliPostsSort: any = {};
  deliPostsCat: any = {};

  constructor(
    private afStore: AngularFirestore,
    private userService: UserService,
    private storage: AngularFireStorage,
    private router: Router,
    private auth: AuthService
    ) {

    this.posts$ = new BehaviorSubject([]);
    this.featuredPosts$ = new BehaviorSubject([]);

    this.afStore
      .collection('posts', ref => ref.orderBy('createdTimestamp', 'desc').limit(50))
      .valueChanges({ idField: 'postId' })
      .pipe(
        map(posts => {
          return posts.map((post: any) => {
            const thumbnail = post.thumbnailPath ? this.getPostThumbnail(post.thumbnailPath, post.thumbnailImgUrl) : undefined;
            return { ...post, thumbnail };
          });
        })
      )
      .subscribe(posts => {
        this.posts$.next(posts);
      });
  }

  getSortedPosts(sort: string = 'recent') {
    return;
  }

  getPostsByCategoryNEW(category: string) {
    return;
  }

  searchPosts(term: string = '') {
    // posts where lowerCaseTitle >= term
    // posts where tags array-contains term
    // - forkjoin -
    // -- remove duplicates --
  }

  getPostsByTitle(title: string) {
    return this.afStore
      .collection('posts', ref => ref
        .where('lowerCaseTitle', '>=', title.toLowerCase())
        .where('lowerCaseTitle', '<=', title.toLowerCase() + 'z'))
      .valueChanges({ idField: 'id' });
  }

  getPostsByTag(tag: string) {
    return this.afStore
      .collection('posts', ref => ref.where('tags', 'array-contains', tag))
      .valueChanges({ idField: 'id' });
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

  getAllPostsBySort(sort: string = 'recent') {
    const opts = { recent: 'createdTimestamp', popular: 'likes', price: 'price' };
    const sortField = opts[sort];

    if (this.deliPostsSort[sortField]) return of(this.deliPostsSort[sortField]);

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
        tap(posts => this.deliPostsSort[sortField] = [...posts])
      );
  }

  getPostsByCategory(category: string, sort: string = 'recent') {
    const opts = { recent: 'createdTimestamp', popular: 'likes', price: 'price' };
    const sortField = opts[sort];

    if (this.deliPostsCat[`${category}-${sortField}`]) return of(this.deliPostsCat[`${category}-${sortField}`]);

    return this.afStore
      .collection('posts', ref => ref.where('category', '==', category).orderBy(sortField, 'desc').limit(20))
      .valueChanges({ idField: 'postId' })
      .pipe(
        map(posts => {
          return posts.map((post: any) => {
            const thumbnail = post.thumbnailPath ? this.getPostThumbnail(post.thumbnailPath, post.thumbnailImgUrl) : undefined;
            return { ...post, thumbnail };
          });
        }),
        tap(posts => this.deliPostsCat[`${category}-${sortField}`] = [...posts])
      );
  }

  filterPostsByTag(tag: string, sort: string = 'recent') {
    const opts = { recent: 'createdTimestamp', popular: 'likes', price: 'price' };
    const sortField = opts[sort];

    return this.afStore
      .collection('posts', ref => ref.where('tags', 'array-contains', tag).orderBy(sortField, 'desc').limit(100))
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
