import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, first } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages$: BehaviorSubject<any> = new BehaviorSubject([]);
  viewingChat$: Observable<any>;

  constructor(
    private afStore: AngularFirestore,
    private userService: UserService
  ) { }

  getUserChats(senderId: string, sender: any) {
    if (!senderId || !sender) return;

    this.afStore
      .collection('chats', ref => ref.where('userIds', 'array-contains', senderId))
      .valueChanges({ idField: 'id' })
      .subscribe(async (chats: any[] = []) => {
        const mapped = [];

        for (const chat of chats) {
          const recipientId = chat.userIds.find((uid: string) => uid !== senderId);
          console.log({ recipientId });
          const recipient = await this.userService.getUserById(recipientId);
          const recipientAvatar$ = this.userService.getUserThumbnail(recipient);

          mapped.push({
            ...chat,
            recipient,
            recipientId,
            recipientAvatar$,
            sender,
            senderId
          });
        }

        console.log(`new chats for ${senderId}`, mapped);
        this.messages$.next(mapped);
      });
  }

  reset() {
    this.messages$.next([]);
  }

  watchSingleChat(uid: string) {
    return this.afStore.doc(`chats/${uid}`).valueChanges();
  }

  setActiveChat(chat: any) {
    this.viewingChat$ = this.watchSingleChat(chat.id);
  }

  async initiateChat(initiatingUserId: string, secondUserId: string) {
    // const chats = await this.userChats$.pipe(first()).toPromise();

    // const existingChat = chats.find(chat => {
    //   return chat.users.some(user => user.uid === secondUserId);
    // });

    // if (existingChat) {
    //   console.log('existing chat', existingChat);
    //   this.openChatBox$.next(existingChat);
    //   return;
    // }

    // const chatDoc = {
    //   users: [{ uid: initiatingUserId, lastViewedTimestamp: Date.now() }, { uid: secondUserId, lastViewedTimestamp: Date.now() }],
    //   messages: [],
    //   userIds: [initiatingUserId, secondUserId]
    // };

    // this.afStore
    //   .collection('chats')
    //   .add(chatDoc)
    //   .then(res => {
    //     this.openMessagesBox$.next(true);
    //     this.router.navigateByUrl('/chats');
    //   })
    //   .catch(e => console.log('error starting chat', e));
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
