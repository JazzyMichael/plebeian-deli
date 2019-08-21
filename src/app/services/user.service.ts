import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    const cachedUsers = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : null;

    this.users$ = new BehaviorSubject(cachedUsers);

    this.afStore.collection('users').valueChanges().subscribe(users => {
      localStorage.setItem('users', JSON.stringify(users));
      this.users$.next(users);
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
    console.log('getUserGalleries uid', uid);
    return this.afStore
      .collection('users', ref => ref.where('membership', '==', 'gallery').where('artists', 'array-contains', uid))
      .valueChanges();
  }

  updateUser(uid: string, obj: any) {
    this.afStore
      .doc(`users/${uid}`)
      .update(obj)
      .then(() => console.log('updated user'))
      .catch((err) => console.log('error updating user'));
  }

  addPost(userId: string, title: string, category: string, content: any) {
    const doc = {
      title,
      category,
      content,
      userId,
      createdTimestamp: Date.now(),
      createdDate: new Date()
    };

    return this.afStore
      .doc(`users/${userId}`)
      .collection('posts')
      .add(doc);
  }

  getPosts(uid: string, limit: number = 5): Observable<any> {
    return this.afStore
      .collection('users')
      .doc(uid)
      .collection('posts', ref => ref.orderBy('createdTimestamp', 'desc').limit(limit))
      .valueChanges({ idField: 'postId' });
  }

}
