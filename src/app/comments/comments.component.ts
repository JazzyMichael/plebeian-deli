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
  @Input() postId: string;
  @Input() postUserId: string;

  @Input() eventId: string;
  @Input() eventUserId: string;

  comments$: Observable<any[]>;
  commentCount: number;

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    if (this.postId) {
      this.comments$ = this.commentsService.watchPostComments(this.postId)
        .pipe(tap(arr => this.commentCount = arr && arr.length ? arr.length : 0));
    }

    if (this.eventId) {
      this.comments$ = this.commentsService.watchEventComments(this.eventId)
        .pipe(tap(arr => this.commentCount = arr && arr.length ? arr.length : 0));
    }
  }

}
