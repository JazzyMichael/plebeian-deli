import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
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

  replying: any;

  canReply: boolean;

  constructor(
    private auth: AuthService,
    private commentsService: CommentsService,
    private snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    const { postUserId } = this.comments.find(c => c.postUserId);

    const user = await this.auth.getCurrentUser();

    this.canReply = user.uid === postUserId;
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
      postId: this.postId,
      postUserId: '',
      sourceCommentId: this.replying.commentId,
      message: text,
      createdTimestamp: new Date()
    };

    await this.commentsService.authorReplyToComment(reply);

    this.replying = null;

    this.snackbar.open('Comment Reply Added!', 'Ok', { duration: 3000 });
  }

}
