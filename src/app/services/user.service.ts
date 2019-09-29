import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, pipe, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$: BehaviorSubject<any>;
  admins$: BehaviorSubject<any>;

  noMoreNewUsers: boolean;

  constructor(
    private afStore: AngularFirestore,
    private storage: AngularFireStorage
    ) {
    // const cachedUsers = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : null;

    this.users$ = new BehaviorSubject([]);
    this.admins$ = new BehaviorSubject([]);

    this.afStore
      .collection('users', ref => ref.orderBy('createdTimestamp', 'asc').limit(10))
      .get()
      .pipe(
        map(users => {
          const newUsers = [];

          users.forEach(user => {
            const userData = user.data();
            newUsers.push({ ...userData, thumbnail: this.getUserThumbnail(userData) });
          });

          return newUsers;
        })
      )
      .subscribe(users => {
        console.log('first users', users);
        this.users$.next(users);
      });

    // this.getAdmins().subscribe(admins => {
    //   this.admins$.next(admins);
    // });
  }

  getMoreUsers() {
    if (this.noMoreNewUsers) {
      console.log('no more users to load');
      return;
    }

    const currentUsers = this.users$.getValue();

    const lastVisible = currentUsers[currentUsers.length - 1].createdTimestamp;

    this.afStore
      .collection('users', ref => ref.orderBy('createdTimestamp', 'asc').startAfter(lastVisible).limit(10))
      .get()
      .pipe(
        tap(x => console.log('tap')),
        map(users => {
          const newUsers = [];

          users.forEach(user => {
            const userData = user.data();
            newUsers.push({ ...userData, thumbnail: this.getUserThumbnail(userData) });
          });

          if (!newUsers.length) {
            this.noMoreNewUsers = true;
          }

          return newUsers;
        })
      )
      .subscribe(users => {
        console.log('users', users);
        this.users$.next([ ...currentUsers, ...users ]);
      });
  }

  getArtists() {
    return this.afStore
      .collection('users', ref => ref.where('membership', '==', 'artist'))
      .valueChanges({ idField: 'idField' })
      .pipe(
        tap(x => console.log('tap'))
      );
  }

  getUserById(uid: string) {
    return this.afStore
      .collection('users')
      .doc(uid)
      .get()
      .pipe(map(doc => doc.data()))
      .toPromise();
  }

  getUserGalleries(uid: string) {
    console.log('getUserGalleries uid', uid);
    return this.afStore
      .collection('users', ref => ref.where('membership', '==', 'gallery').where('artists', 'array-contains', uid))
      .valueChanges()
      .pipe(
        tap(x => console.log('tap'))
      );
  }

  updateUser(uid: string, obj: any) {
    this.afStore
      .doc(`users/${uid}`)
      .update(obj)
      .then(() => console.log('updated user'))
      .catch((err) => console.log('error updating user'));
  }

  getUserThumbnail(user: any, size: number = 100): Observable<any> {
    const uid = user.uid;
    const type = user.profileType;

    if (!type) {
      console.log('no type', user);
      return of(user.profileUrl);
    }

    const path = `profile-pictures/thumbnails/${uid}_${size}x${size}.${type}`;

    console.log('path', path);

    const ref = this.storage.ref(path);

    return ref.getDownloadURL();
  }

  // getAdmins() {
  //   return this.afStore
  //     .collection('users', ref => ref.where('admin', '==', true).limit(3))
  //     .valueChanges({ idField: 'userId' });
  // }
}
