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
    if (!uid) {
      return;
    }

    this.afStore
      .collection('chats', ref => ref.where('userIds', 'array-contains', uid))
      .valueChanges({ idField: 'id' })
      .pipe(
        switchMap(async (chats: any) => {

          for await (let chat of chats) {

            const otherUserIdIndex = chat.users.findIndex((u: any) => u.uid !== uid);

            const otherUserId = chat.users[otherUserIdIndex].uid;

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
      return chat.users.some(user => user.uid === secondUserId);
    });

    if (existingChat) {
      console.log('existing chat', existingChat);
      this.openChatBox$.next(existingChat);
      return;
    }

    const chatDoc = {
      users: [{ uid: initiatingUserId, lastViewedTimestamp: Date.now() }, { uid: secondUserId, lastViewedTimestamp: Date.now() }],
      messages: [],
      userIds: [initiatingUserId, secondUserId]
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

  updateChat(docId: string, chatObj: any) {
    this.afStore
      .collection('chats')
      .doc(docId)
      .update(chatObj)
      .then(() => console.log('chat updated'))
      .catch(e => console.log('error updating chat', e));
  }
}
