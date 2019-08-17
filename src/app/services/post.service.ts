import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    const cachedPosts = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : [];

    this.posts$ = new BehaviorSubject(cachedPosts);

    this.afStore
      .collectionGroup('posts', ref => ref.orderBy('createdTimestamp', 'desc')
      .limit(10))
      .valueChanges()
      .subscribe(posts => {
        localStorage.setItem('posts', JSON.stringify(posts));
        this.posts$.next(posts);
      });
  }
}
