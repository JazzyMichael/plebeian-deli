import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    const cachedPosts = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : [];

    this.posts$ = new BehaviorSubject(cachedPosts);

    this.afStore
      .collectionGroup('posts', ref => ref.orderBy('createdTimestamp', 'desc').limit(10))
      .snapshotChanges()
      .pipe(
        map((actions: any) => actions.map(a => {
          const data = a.payload.doc.data();
          const postId = a.payload.doc.id;
          return { postId, ...data };
        }))
      )
      .subscribe(posts => {
        localStorage.setItem('posts', JSON.stringify(posts));
        this.posts$.next(posts);
      });
  }

  getPost(userId: string, postId: string) {
    return this.afStore
      .collection('users')
      .doc(userId)
      .collection('posts')
      .doc(postId)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data();
          const newPostId = action.payload.id;
          return { postId: newPostId, ...data };
        })
      );
  }
}
