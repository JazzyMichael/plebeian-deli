import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post$: Observable<any>;
  userPosts$: Observable<any>;
  featuredPosts$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postId = params.get('id');
      console.log('param post id', postId);

      if (!postId) {
        return this.router.navigateByUrl('/deli');
      }

      document.querySelector('.main-container').scrollTop = 0;

      this.post$ = this.postService.getPost(postId)
        .pipe(
          tap(post => {
            this.userPosts$ = this.postService.getUserPosts(post.userId, 3);
          })
        );

      this.featuredPosts$ = this.postService.featuredPosts$.asObservable();
    });
  }

}
