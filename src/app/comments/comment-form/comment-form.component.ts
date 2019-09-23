import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Input() deliPostId: string;
  @Input() primePostId: string;

  newComment: string;

  constructor(public authService: AuthService, private commentsService: CommentsService) { }

  ngOnInit() {
  }

  submitComment(userId: string, username: string) {

    const obj = {
      userId,
      username,
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
        window.alert('Comment Saved!');
        this.newComment = '';
      });
  }

}
