import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private db: AngularFirestore) { }

  saveMessage(message: any) {
    return this.db.collection('contact-messages').add(message);
  }

  getMessages(): Observable<any[]> {
    return this.db.collection('contact-messages')
      .valueChanges({ idField: 'id' });
  }

  toggleAcknowledge(uid: string, acknowledged: boolean, acknowledgedBy: string): Promise<void> {
    return this.db
      .doc(`contact-messages/${uid}`)
      .update({ acknowledged, acknowledgedBy });
  }
}
