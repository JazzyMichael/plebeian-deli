import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  post$: Observable<any>;
  userPosts$: Observable<any>;
  featuredPosts$: Observable<any>;
  alreadyLiked: boolean;
  postId: string;
  carouselIndex = 0;

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

      this.postId = postId;

      document.querySelector('.main-container').scrollTop = 0;

      this.post$ = this.postService.getPost(postId)
        .pipe(
          tap(post => {
            if (!post) {
              return this.router.navigateByUrl('/deli');
            }

            this.userPosts$ = this.postService.getUserPosts(post.userId, 3);
          })
        );

      this.featuredPosts$ = this.postService.featuredPosts$.asObservable();
    });
  }

  likePost() {
    if (this.alreadyLiked) {
      // unlike
      this.alreadyLiked = false;
    } else {
      // like
      this.alreadyLiked = true;
    }
  }

  facebookShare() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=plebeiandeli.art/post/${this.postId}`, '_blank');
  }

}
