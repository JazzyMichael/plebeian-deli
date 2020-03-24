import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private afStore: AngularFirestore) { }

  watchPostComments(postId: string) {
    return this.afStore
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .valueChanges({ idField: 'commentId' });
  }

  watchEventComments(eventId: string) {
    return this.afStore
      .collection('events')
      .doc(eventId)
      .collection('comments')
      .valueChanges({ idField: 'commentId' });
  }

  replyToPostComment(reply: any) {
    return this.afStore
      .collection('posts')
      .doc(reply.postId)
      .collection('comments')
      .doc(reply.sourceCommentId)
      .update({ authorReply: reply });
  }

  replyToEventComment(reply: any) {
    return this.afStore
      .collection('events')
      .doc(reply.eventId)
      .collection('comments')
      .doc(reply.sourceCommentId)
      .update({ authorReply: reply });
  }

  // add to notifications for each user who commented
  addPostComment(postId: string, commentObj: any) {
    return this.afStore
      .collection('posts')
      .doc(postId)
      .collection('comments')
      .add(commentObj);
  }

  addEventComment(eventId: string, commentObj: any) {
    return this.afStore
      .collection('events')
      .doc(eventId)
      .collection('comments')
      .add(commentObj);
  }
}
