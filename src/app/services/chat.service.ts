import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  userChats$: BehaviorSubject<any>;

  constructor(private afStore: AngularFirestore) {
    this.userChats$ = new BehaviorSubject(null);
  }

  getUserChats(uid: string) {
    // const ref = this.afStore.collection('chats');
    // const query = ref.

    this.afStore
      .collection('chats', ref => ref.where('users', 'array-contains', uid))
      .valueChanges({ idField: 'id' })
      // .pipe(
      //   map(async (chat) => {
      //     console.log(chat.rootChatId);
          // const docRef = this.afStore.collection('chats').doc(chat.rootChatId);
          // docRef.get().toPromise().then(doc => {
          //   console.log('got doc', doc);
          // })
          // .catch(err => console.log('error getting doc', err));

          // const docVal = await doc.toPromise();
          // console.log('docVal', docVal);
          // const data = docVal.data();
          // console.log('data', data);
          // const otherUid = data.users.find(userId => userId !== uid);
      //     return { ...chat };
      //   })
      // )
      .subscribe(chats => {
        console.log(chats);
        this.userChats$.next(chats);
      });
  }
}
