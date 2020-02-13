import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    this.events$ = new BehaviorSubject([]);

    this.afStore
      .collection('events', ref => ref.orderBy('date', 'desc'))
      .valueChanges({ idField: 'eventId' })
      .subscribe(events => {
        this.events$.next(events);
      });
  }

  getUserEvents(uid: string) {
    return this.afStore
      .collection('events', ref => ref.where('userId', '==', uid))
      .valueChanges({ idField: 'eventId' });
  }

  deleteEvent(eventId: string) {
    return this.afStore
      .collection('events')
      .doc(eventId)
      .delete();
  }

  getEvent(eventId: string) {
    return this.afStore
      .collection('events')
      .doc(eventId)
      .valueChanges();
  }

  getGalleryEvents(galleryId: string) {
    return this.afStore
      .collection('events', ref => ref.where('galleryId', '==', galleryId))
      .valueChanges({ idField: 'eventId' });
  }

  addEvent(event: any) {
    return this.afStore.collection('events').add(event);
  }

}
