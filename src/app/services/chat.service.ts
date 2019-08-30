import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  userChats$: BehaviorSubject<any>;
  openChatBox$: Subject<any>;
  openMessagesBox$: Subject<any>;

  constructor(private afStore: AngularFirestore) {
    this.userChats$ = new BehaviorSubject([]);
    this.openChatBox$ = new Subject();
    this.openMessagesBox$ = new Subject();
  }

  getUserChats(uid: string) {
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
        this.userChats$.next(chats);
      });
  }

  watchSingleChat(docId: string) {
    return this.afStore
      .collection('chats')
      .doc(docId)
      .valueChanges();
  }

  async initiateChat(initiatingUserId: string, secondUserId: string) {
    const chats = await this.userChats$.pipe(first()).toPromise();

    const existingChat = chats.find(chat => {
      return chat.users.some(userId => userId === secondUserId);
    });

    if (existingChat) {
      // open chat box to that chat
      console.log('existingChat');
      this.openChatBox$.next(existingChat);
      return;
    }

    const chatDoc = {
      users: [initiatingUserId, secondUserId],
      messages: []
    };

    this.afStore
      .collection('chats')
      .add(chatDoc)
      .then(res => {
        this.openMessagesBox$.next(true);
      })
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
