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

  getBorderColor(cat: string) {
    switch (cat) {
      case 'sculpture': return '#89fdf6';
      case 'design': return '#9888ff';
      case 'illustration': return '#ff5959';
      case 'painting': return '#ff9f59';
      case 'animation': return '#fdf5a2';
      case 'photography': return '#4caf50';
      default: return '#ff4081';
    }
  }

}
