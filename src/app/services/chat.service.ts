import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  userChats$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    this.userChats$ = new BehaviorSubject(null);
  }

  getUserChats(uid: string) {
    console.log('getUserChats', uid);

    this.afStore
      .collection('chats', ref => ref.where('users', 'array-contains', uid))
      .valueChanges({ idField: 'id' })
      .pipe(
        switchMap(async (chats: any) => {

          for await (let chat of chats) {

            const otherUserIdIndex = chat.users.findIndex((u: string) => u !== uid);

            const otherUserId = chat.users[otherUserIdIndex];

            const otherUserDoc = await this.afStore.collection('users').doc(otherUserId).get().toPromise();

            const otherUser = otherUserDoc.data();

            chat['otherUser'] = otherUser;

          }

          return chats;
        })
      )
      .subscribe((chats: any[]) => {
        console.log('chats', chats);
        this.userChats$.next(chats);
      });
  }

  watchSingleChat(docId: string) {
    return this.afStore
      .collection('chats')
      .doc(docId)
      .valueChanges();
  }

  initiateChat(initiatingUserId: string, secondUserId: string, message: string = 'Hello!') {
    const chatDoc = {
      users: [initiatingUserId, secondUserId],
      messages: [
        {
          content: message,
          userId: initiatingUserId,
          timestamp: Date.now()
        }
      ]
    };

    this.afStore
      .collection('chats')
      .add(chatDoc)
      .then(res => console.log('chat started'))
      .catch(e => console.log('error starting chat', e));
  }

  addChatMessage(docId: string, messages: any[]) {
    this.afStore
    .collection('chats')
    .doc(docId)
    .update({ messages })
    .then(() => console.log('message sent'))
    .catch(e => console.log('error sending message', e));
  }
}
