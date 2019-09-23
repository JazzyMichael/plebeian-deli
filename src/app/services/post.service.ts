import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts$: BehaviorSubject<any>;
  featuredPosts$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore, private router: Router) {
    this.posts$ = new BehaviorSubject([]);
    this.featuredPosts$ = new BehaviorSubject([]);

    this.afStore
      .collection('posts', ref => ref.orderBy('createdTimestamp', 'desc').limit(50))
      .valueChanges({ idField: 'postId' })
      .subscribe(posts => {
        this.posts$.next(posts);
      });
  }

  getPostsByCategory(category: string) {
    return this.afStore
      .collection('posts', ref => ref.where('category', '==', category).limit(10))
      .valueChanges({ idField: 'postId' });
  }

  getUserPosts(uid: string, limit: number = 10): Observable<any> {
    return this.afStore
      .collection('posts', ref => ref.where('userId', '==', uid).orderBy('createdTimestamp', 'desc').limit(limit))
      .valueChanges({ idField: 'postId' });
  }

  getPost(id: string): Observable<any> {
    return this.afStore
      .doc(`posts/${id}`)
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
              map(user => {
                return { ...post, postId: id, user: user.data() };
              })
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
}
