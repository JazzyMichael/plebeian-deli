import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrimeCutsService {
  primePosts$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  featureFriday$: BehaviorSubject<any> = new BehaviorSubject(null);
  featuredFour$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  noMorePrimePosts: boolean;

  constructor(
    private afStore: AngularFirestore
  ) {
    // first round of prime cuts
    this.afStore
      .collection('prime-cuts', ref => ref.orderBy('createdTimestamp', 'desc').limit(10))
      .get()
      .pipe(
        map(posts => {
          const newPosts = [];

          posts.forEach(post => {
            newPosts.push({ ...post.data(), primePostId: post.id });
          });

          return newPosts;
        })
      )
      .subscribe(posts => {
        this.primePosts$.next(posts);
      });

    // feature friday
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

    // featured four
    this.afStore
      .collection('featured')
      .doc('prime-cuts')
      .valueChanges()
      .pipe(
        tap(x => console.log('tap'))
      )
      .subscribe((featured: any) => {
        if (featured && featured.postIds) {
          const ids = featured.postIds.splice(0, 4);
          const promises = [];

          for (const id of ids) {
            const promise = this.afStore.collection('prime-cuts').doc(id).get().toPromise();
            promises.push(promise);
          }

          Promise.all(promises)
            .then((results: any[] = []) => {
              const posts = [];

              results.forEach(r => {
                posts.push({ ...r.data(), primePostId: r.id });
              });

              this.featuredFour$.next(posts);
            })
            .catch(e => {
              console.log('Error getting featured prime-cuts posts', e);
            });
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
        tap(x => console.log('tap')),
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
      .get()
      .pipe(
        switchMap((posty: any) => {
          if (!posty) {
            return of(null);
          }

          const post = posty.data();

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
