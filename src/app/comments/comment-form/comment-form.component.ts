import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Input() postId: string;
  @Input() postUserId: string;
  @Input() eventId: string;
  @Input() eventUserId: string;

  newComment: string;

  constructor(
    public auth: AuthService,
    private commentsService: CommentsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  submitComment(userId: string, username: string) {

    const obj = {
      userId,
      username,
      postId: this.postId || '',
      eventId: this.eventId || '',
      postUserId: this.postUserId || '',
      eventUserId: this.eventUserId || '',
      message: this.newComment,
      createdTimestamp: new Date()
    };

    let prom: Promise<any>;

    if (this.postId) {
      prom = this.commentsService.addPostComment(this.postId, obj);
    }

    if (this.eventId) {
      prom = this.commentsService.addEventComment(this.eventId, obj);
    }

    if (!prom) return;

    prom
      .then(res => {
        this.snackbar.open('Comment Added!', '', { duration: 2500 });
        this.newComment = '';
      });
  }

}
