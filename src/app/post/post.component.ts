import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post$: Observable<any>;
  user: any;
  userPosts$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postParam = params.get('id');

      if (!postParam) {
        return this.router.navigateByUrl('/deli');
      }

      document.querySelector('.main-container').scrollTop = 0;

      const split = postParam.split('split');

      const userId = split[0];
      const postId = split[1];

      this.post$ = this.postService.getPost(userId, postId);

      this.userPosts$ = this.userService.getPosts(userId, 3);

      this.user = await this.userService.getUserById(userId);
    });
  }

}
