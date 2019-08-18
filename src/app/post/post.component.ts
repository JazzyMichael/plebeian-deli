import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      const postParam = params.get('id');

      if (!postParam) {
        return this.router.navigateByUrl('/deli');
      }

      const split = postParam.split('split');

      const userId = split[0];
      const postId = split[1];

      this.post$ = this.postService.getPost(userId, postId);
    });
  }

}
