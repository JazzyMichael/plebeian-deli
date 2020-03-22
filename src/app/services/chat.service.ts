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

  formatNewChat(userId: string, recipientId: string, content: string) {
    return {
      timestamp: Date.now(),
      userIds: [userId, recipientId],
      messages: [{
        timestamp: Date.now(),
        content,
        userId
      }]
    };
  }

  createChat(userId: string, recipientId: string, message: string) {
    const chat = this.formatNewChat(userId, recipientId, message);

    return this.afStore.collection('chats').add(chat);
  }

  addChatMessage(docId: string, messages: any[]) {
    return this.afStore.doc(`chats/${docId}`).update({ messages });
  }

}
