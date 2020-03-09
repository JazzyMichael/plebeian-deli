import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  newCount$: BehaviorSubject<number> = new BehaviorSubject(0);

  canInstall: boolean;
  deferredPrompt: any;

  constructor(private afStore: AngularFirestore) { }

  getNew(uid: string) {
    console.log('getNew');
    this.afStore
      .collection('users')
      .doc(uid)
      .collection('notifications', ref => ref.where('new', '==', true).orderBy('createdTimestamp', 'desc'))
      .valueChanges({ idField: 'notificationId' })
      .subscribe(x => {
        console.log('notifications', x);
        const count = x && x.length ? x.length : 0;
        this.newCount$.next(count);
        if (x) {
          this.notifications$.next(x);
        }
      });
  }

  reset() {
    this.notifications$.next([]);
    this.newCount$.next(0);
  }

  getOld(uid: string, startAfterDoc?: any): Observable<any[]> {
    // returns 10 already-viewed notifications
    // component should append and manage results

    if (!startAfterDoc) {

      return this.afStore
        .collection('users')
        .doc(uid)
        .collection('notifications', ref =>
          ref.where('new', '==', false)
          .orderBy('createdTimestamp', 'desc')
          .limit(10))
        .valueChanges({ idField: 'notificationId' });

    } else {

      return this.afStore
        .collection('users')
        .doc(uid)
        .collection('notifications', ref =>
          ref.where('new', '==', false)
          .orderBy('createdTimestamp', 'desc')
          .startAfter(startAfterDoc)
          .limit(10))
        .valueChanges({ idField: 'notificationId' });

    }

  }

  addNotification(uid: string, obj: any) {
    this.afStore
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .add(obj)
      .then(() => console.log('notifcation added successfully'))
      .catch(e => console.log('error adding notification', e));
  }

  updateNotification(uid: string, notificationId: string, obj: any) {
    this.afStore
      .collection('users')
      .doc(uid)
      .collection('notifications')
      .doc(notificationId)
      .update(obj)
      .then(() => console.log('notification updated'))
      .catch(e => console.log('error updating notification', e));
  }

}
