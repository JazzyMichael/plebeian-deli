import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events$: BehaviorSubject<any>;
  editingEvent: any;

  constructor(
    private afStore: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AuthService
  ) {
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

  updateEvent(eventId: string, event: any) {
    return this.afStore
      .collection('events')
      .doc(eventId)
      .update(event);
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

  async saveNewEvent(image: any, eventForm: any) {
    const random = Math.random().toString().slice(3, 9);
    const { uid } = await this.auth.getCurrentUser();

    const imageFileType = image.type.split('/')[1];
    const imagePath = `event-images/${uid.substring(0, 10)}-${random}.${imageFileType}`;
    const metadata = { customMetadata: { userId: '' }};

    const ref = this.storage.ref(imagePath);
    await this.storage.upload(imagePath, image, metadata);

    const imageUrl = await ref.getDownloadURL().toPromise();
    const thumbnailStoragePathBase = `event-images/thumbnails/${uid.substring(0, 10)}-${random}`;
    const thumbnailStoragePath = `${thumbnailStoragePathBase}_250x250.${imageFileType}`;

    const newEvent = {
      ...eventForm,
      createdTimestamp: new Date(),
      userId: uid,
      thumbnailStoragePath,
      thumbnailStoragePathBase,
      imageUrl,
      imagePath,
      imageFileType
    };

    await this.addEvent(newEvent);
  }

}
