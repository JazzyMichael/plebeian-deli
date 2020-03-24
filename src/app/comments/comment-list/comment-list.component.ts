import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentsService } from 'src/app/services/comments.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  @Input() comments: any[];
  @Input() postId: string;
  @Input() eventId: string;

  canReply: boolean;
  replying: any;

  constructor(
    private auth: AuthService,
    private commentsService: CommentsService,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    const { postUserId, eventUserId } = this.comments.find(c => c.postUserId || c.eventUserId) || { postUserId: null, eventUserId: null };

    const user = await this.auth.getCurrentUser();

    this.canReply = user && (user.uid === postUserId || user.uid === eventUserId);
  }

  startReply(comment: any) {
    this.replying = comment;
  }

  endReply() {
    this.replying = null;
  }

  async submitReply(text: string) {
    const user = await this.auth.getCurrentUser();

    const reply = {
      userId: user.uid,
      username: user.username,
      postId: this.postId || '',
      postUserId: '',
      eventId: this.eventId || '',
      eventUserId: '',
      sourceCommentId: this.replying.commentId,
      sourceCommentUserId: this.replying.userId,
      message: text,
      createdTimestamp: new Date()
    };

    if (this.postId) await this.commentsService.replyToPostComment(reply);
    if (this.eventId) await this.commentsService.replyToEventComment(reply);

    this.replying = null;

    this.snackbar.open('Comment Reply Added!', 'Ok', { duration: 3000 });
  }

}
