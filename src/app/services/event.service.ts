import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    const cachedEvents = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

    this.events$ = new BehaviorSubject(cachedEvents);

    this.afStore
      .collectionGroup('events')
      .valueChanges()
      .subscribe(events => {
        localStorage.setItem('events', JSON.stringify(events));
        this.events$.next(events);
      });
  }

  getGalleryEvents(uid: string) {
    return this.afStore
      .collection('users')
      .doc(uid)
      .collection('events');
  }

  addEvent(uid: string, event: any) {
    this.afStore
      .collection('users')
      .doc(uid)
      .collection('events')
      .add(event)
      .then(res => console.log('event added successfully'))
      .catch(e => console.log('error adding event', e));
  }

}
