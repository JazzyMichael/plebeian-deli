import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Input() deliPostId: string;
  @Input() primePostId: string;
  @Input() postUserId: string;

  newComment: string;

  constructor(
    public authService: AuthService,
    private commentsService: CommentsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  submitComment(userId: string, username: string) {

    const obj = {
      userId,
      username,
      postId: this.deliPostId,
      postUserId: this.postUserId,
      message: this.newComment,
      createdTimestamp: new Date()
    };

    let prom: Promise<any>;

    if (this.deliPostId) {
      prom = this.commentsService.addDeliComment(this.deliPostId, obj);
    } else if (this.primePostId) {
      prom = this.commentsService.addPrimeComment(this.primePostId, obj);
    }

    if (!prom) {
      return;
    }

    prom
      .then(res => {
        this.snackbar.open('Comment Added!', 'Ok', { duration: 3000 });
        this.newComment = '';
      });
  }

}
