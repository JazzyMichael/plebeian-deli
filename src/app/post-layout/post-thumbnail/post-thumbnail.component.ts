import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-thumbnail',
  templateUrl: './post-thumbnail.component.html',
  styleUrls: ['./post-thumbnail.component.scss']
})
export class PostThumbnailComponent implements OnInit {

  @Input() post: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  postClick(postId: string) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

}
