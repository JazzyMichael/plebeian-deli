import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PrimeCutsService {
  primePosts$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private afStore: AngularFirestore
  ) {
    this.afStore
      .collection('prime-cuts', ref => ref.orderBy('createdTimestamp', 'desc').limit(10))
      .valueChanges({ idField: 'primePostId' })
      .subscribe(posts => {
        this.primePosts$.next(posts);
      });
  }

  getUserPrimePosts(uid: string, limit: number = 3) {
    return this.afStore
      .collection('prime-cuts', ref => ref.where('userId', '==', uid).orderBy('createdTimestamp', 'desc').limit(limit))
      .valueChanges({ idField: 'primePostId' });
  }

}
