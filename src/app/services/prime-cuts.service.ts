import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrimeCutsService {
  primePosts$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  featureFriday$: BehaviorSubject<any> = new BehaviorSubject(null);
  noMorePrimePosts: boolean;

  constructor(
    private afStore: AngularFirestore
  ) {
    this.afStore
      .collection('prime-cuts', ref => ref.orderBy('createdTimestamp', 'desc').limit(10))
      .valueChanges({ idField: 'primePostId' })
      .subscribe(posts => {
        this.primePosts$.next(posts);
      });

    this.afStore
      .collection('prime-cuts', ref => ref.where('featureFriday', '==', true).orderBy('createdTimestamp', 'desc').limit(1))
      .valueChanges({ idField: 'primePostId' })
      .subscribe(post => {
        if (post && post[0]) {
          this.featureFriday$.next(post[0]);
        } else {
          this.featureFriday$.next(post);
        }
      });
  }

  getMorePrimeCuts() {
    if (this.noMorePrimePosts) {
      return;
    }

    const currentCuts = this.primePosts$.getValue();

    const lastVisible = currentCuts[currentCuts.length - 1].createdTimestamp;

    this.afStore
      .collection('prime-cuts', ref => ref.orderBy('createdTimestamp', 'desc').startAfter(lastVisible).limit(10))
      .get()
      .pipe(
        map(cuts => {
          const docs = [];
          cuts.forEach(cut => {
            docs.push({ ...cut.data(), primePostId: cut.id });
          });
          return docs;
        })
      )
      .subscribe(cuts => {
        console.log('cuts', cuts);
        this.primePosts$.next([ ...currentCuts, ...cuts ]);
      });
  }

  getUserPrimePosts(uid: string, limit: number = 3) {
    return this.afStore
      .collection('prime-cuts', ref => ref.where('userId', '==', uid).orderBy('createdTimestamp', 'desc').limit(limit))
      .valueChanges({ idField: 'primePostId' });
  }

  getPrimePost(id: string): Observable<any> {
    return this.afStore
      .collection('prime-cuts')
      .doc(id)
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
                return { ...post, primePostId: id, user: user.data() };
              })
            );
        })
      );
  }

}
