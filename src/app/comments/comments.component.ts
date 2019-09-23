import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentsService } from '../services/comments.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() deliPostId: string;
  @Input() primePostId: string;
  @Input() postUserId: string;

  comments$: Observable<any[]>;
  commentCount: number;

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    if (this.deliPostId) {
      this.comments$ = this.commentsService.watchDeliPostComments(this.deliPostId)
        .pipe(tap(arr => this.commentCount = arr && arr.length ? arr.length : 0));
    } else if (this.primePostId) {
      this.comments$ = this.commentsService.watchPrimePostComments(this.primePostId)
        .pipe(tap(arr => this.commentCount = arr && arr.length ? arr.length : 0));
    }
  }

}
