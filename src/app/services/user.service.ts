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
      .collection('users', ref => ref.orderBy('createdTimestamp', 'asc').limit(20))
      .get()
      .pipe(
        map(users => {
          const newUsers = [];

          users.forEach(user => {
            const userData = user.data();

            newUsers.push({
              ...userData,
              thumbnail: this.getUserThumbnail(userData),
              backgroundThumbnail: this.getUserBackground(userData)
            });
          });

          return newUsers;
        })
      )
      .subscribe(users => {
        this.users$.next(users);
      });
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
        map(users => {
          const newUsers = [];

          users.forEach(user => {
            const userData = user.data();

            newUsers.push({
              ...userData,
              thumbnail: this.getUserThumbnail(userData),
              backgroundThumbnail: this.getUserBackground(userData)
            });
          });

          if (!newUsers.length) {
            this.noMoreNewUsers = true;
          }

          return newUsers;
        })
      )
      .subscribe(users => {
        this.users$.next([ ...currentUsers, ...users ]);
      });
  }

  getArtists() {
    return this.afStore
      .collection('users', ref => ref.where('membership', '==', 'artist'))
      .valueChanges({ idField: 'idField' });
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
    return this.afStore
      .collection('users', ref => ref.where('membership', '==', 'gallery').where('artists', 'array-contains', uid))
      .valueChanges();
  }

  updateUser(uid: string, obj: any) {
    this.afStore
      .doc(`users/${uid}`)
      .update(obj)
      .then(() => console.log('updated user'))
      .catch(e => console.log('error updating user', e));
  }

  updateUserPromise(uid: string, obj: any) {
    return this.afStore
      .doc(`users/${uid}`)
      .update(obj)
      .catch(e => console.log('oops', e));
  }

  getUserThumbnail(user: any, size: number = 100): Observable<any> {
    const uid = user.uid;
    const type = user.profileType;

    if (!type) {
      // console.log('no profile type', user);
      return of(user.profileUrl);
    }

    const path = `profile-pictures/thumbnails/${uid}_${size}x${size}.${type}`;

    const ref = this.storage.ref(path);

    return ref.getDownloadURL();
  }

  getUserBackground(user: any, size: number = 500): Observable<any> {
    const uid = user.uid;
    const type = user.backgroundType;

    if (!type) {
      // console.log('no bg type', user);
      return of('');
    }

    const path = `profile-backgrounds/thumbnails/${uid}_${size}x${size}.${type}`;

    const ref = this.storage.ref(path);

    return ref.getDownloadURL();
  }

  // getAdmins() {
  //   return this.afStore
  //     .collection('users', ref => ref.where('admin', '==', true).limit(3))
  //     .valueChanges({ idField: 'userId' });
  // }
}
