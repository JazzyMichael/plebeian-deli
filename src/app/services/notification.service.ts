import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(private afStore: AngularFirestore) { }

  getNew(uid: string) {
    this.afStore
      .collection('users')
      .doc(uid)
      .collection('notifications', ref => ref.where('new', '==', true).orderBy('createdTimestamp'))
      .valueChanges({ idField: 'notificationId' })
      .subscribe(x => {
        if (x) {
          this.notifications$.next(x);
        }
      });
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

  addCommenterNotifications(commenters: any[]) {
    const promises = [];

    for (const obj of commenters) {
      const prom = this.afStore
        .collection('users')
        .doc(obj.userId)
        .collection('notifications')
        .add(obj.notificationObj);

      promises.push(prom);
    }

    Promise.all(promises)
      .then(() => console.log('Comment Notifications Success'))
      .catch(e => console.log('Comment Notification Error', e));
  }

}
