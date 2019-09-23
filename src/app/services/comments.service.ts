import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private afStore: AngularFirestore) { }

  watchDeliPostComments(postId: string) {
    return this.afStore
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .valueChanges({ idField: 'commentId' });
  }

  watchPrimePostComments(postId: string) {
    return this.afStore
      .collection('prime-cuts')
      .doc(postId)
      .collection('comments')
      .valueChanges({ idField: 'commentId' });
  }


  // add to notifications for each user who commented
  addDeliComment(postId: string, commentObj: any) {
    return this.afStore
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add(commentObj);
  }

  addPrimeComment(postId: string, commentObj: any) {
    return this.afStore
      .collection('prime-cuts')
      .doc(postId)
      .collection('comments')
      .add(commentObj);
  }
}
