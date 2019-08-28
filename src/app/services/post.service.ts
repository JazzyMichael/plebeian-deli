import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts$: BehaviorSubject<any>;
  featuredPosts$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    const cachedPosts = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : [];

    this.posts$ = new BehaviorSubject(cachedPosts);
    this.featuredPosts$ = new BehaviorSubject([]);

    this.afStore
      .collection('posts', ref => ref.orderBy('createdTimestamp', 'desc').limit(50))
      .valueChanges({ idField: 'postId' })
      .subscribe(posts => {
        localStorage.setItem('posts', JSON.stringify(posts));
        this.posts$.next(posts);
      });

    this.afStore.collection('posts', ref => ref.where('featured', '==', true).limit(3))
      .valueChanges({ idField: 'postId' })
      .subscribe(posts => {
        this.featuredPosts$.next(posts);
      });
  }

  getPostsByCategory(category: string) {
    return this.afStore
      .collection('posts', ref => ref.where('category', '==', category).limit(10))
      .valueChanges({ idField: 'postId' });
  }

  getUserPosts(uid: string, limit: number = 10): Observable<any> {
    console.log('getUserPosts uid', uid);
    return this.afStore
      .collection('posts', ref => ref.where('userId', '==', uid).orderBy('createdTimestamp', 'desc').limit(limit))
      .valueChanges({ idField: 'postId' });
  }

  getPost(id: string): Observable<any> {
    console.log('getPost id', id);

    return this.afStore
      .doc(`posts/${id}`)
      .valueChanges()
      .pipe(
        // map(action => {
        //   const data = action.payload.data();
        //   const postId = action.payload.id;
        //   console.log('map data', data);
        //   console.log('map postId', postId);
        //   return { postId, ...data };
        // }),
        switchMap((post: any) => {
          console.log('map post', post);
          return this.afStore
            .doc(`users/${post.userId}`)
            .get()
            .pipe(
              map(user => {
                console.log('pipe map user', user.data());
                return { ...post, user: user.data() };
              })
            );
            // .then(userDoc => {
            //   const userData = userDoc.data();

            //   console.log('userData', userData);

            //   post['postId'] = id;
            //   post['user'] = userData;

            //   console.log('returning post', post);

            //   return of(post);
            // })
            // .catch(e => {
            //   console.log('error joining user to post', e);
            //   return of(e);
            // });
        })
      );
  }

  createPost(post: any) {
    return this.afStore.collection('posts').add(post);
  }

  likePost(postId: string, currentLikes: number) {
    this.afStore.collection('posts').doc(postId).update({ likes: currentLikes + 1})
      .then(() => console.log('liked successfully'))
      .catch(e => console.log('error liking post', e));
  }
}
