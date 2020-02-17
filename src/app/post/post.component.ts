import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { tap, catchError, debounceTime, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  post$: Observable<any>;
  recentPosts$: Observable<any>;
  featuredPosts$: Observable<any>;

  postId: string;
  postUserId: string;
  carouselIndex = 0;

  likedUids: string[];
  alreadyLiked: boolean;
  likeCount: number;
  likeDebouncer: Subject<any> = new Subject();
  debounceSub: Subscription;

  user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postId = params.get('id');

      if (!postId) {
        return this.router.navigateByUrl('/deli');
      }

      this.postId = postId;

      document.querySelector('.mat-drawer-content').scrollTop = 0;
      document.querySelector('.mat-sidenav-content').scrollTop = 0;

      this.user = await this.authService.getCurrentUser();

      this.post$ = this.postService.getPost(postId)
        .pipe(
          tap(post => {
            if (!post) {
              return this.router.navigateByUrl('/deli');
            }

            console.log('tags:', post.tags);

            this.postUserId = post.userId;
            this.likedUids = post.likedUids && post.likedUids.length ?
              post.likedUids :
              [];

            if (post.likedUids && post.likedUids.length) {
              this.likeCount = post.likedUids.length;
              this.alreadyLiked = this.user && post.likedUids.some(x => x === this.user.uid);
            } else {
              this.likeCount = 0;
              this.alreadyLiked = false;
            }

            this.recentPosts$ = this.postService.posts$.pipe(map((x: any[]) => x.slice(0, 4)));
          })
        );

      this.featuredPosts$ = this.postService.featuredPosts$.asObservable();
    });

    this.debounceSub = this.likeDebouncer
      .pipe(debounceTime(1111))
      .subscribe(x => {
        if (x) {
          if (this.likedUids.some(x => x === this.user.uid)) {
            console.log('no changes');
            return;
          }
          // liked
          console.log('liked');
          // update post userLikes array with uid
          this.likedUids.push(this.user.uid);
          this.postService.updatePost(this.postId, { likedUids: this.likedUids })
            .then(res => console.log(res));
          // update post user notifications
          const obj = {
            userId: this.user.uid,
            username: this.user.username,
            postId: this.postId,
            createdTimestamp: new Date(),
            new: true,
            type: 'like',
            postThumbnailUrl: ''
          };
          this.notificationService.addNotification(this.postUserId, obj);
        } else {
          // unliked

          const likedUids = this.likedUids.filter(x => x !== this.user.uid);
          if (likedUids.length === this.likedUids.length) {
            console.log('no changes');
            return;
          }

          console.log('unliked');

          this.postService.updatePost(this.postId, { likedUids })
            .then(res => console.log(res));
        }
      });
  }

  ngOnDestroy() {
    if (this.debounceSub) {
      this.debounceSub.unsubscribe();
    }
  }

  async likePost() {
    // if not signed in show popup
    // console.log('liked click user', this.user);
    if (!this.user) {
      return window.alert('Log in to Like Posts!');
    }

    if (this.alreadyLiked) {
      // unlike
      this.alreadyLiked = false;
      this.likeDebouncer.next(false);
    } else {
      // like
      this.alreadyLiked = true;
      this.likeDebouncer.next(true);
    }
  }

  searchByTag(tag: string) {
    console.log(tag);
  }

  facebookShare() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=plebeiandeli.art/post/${this.postId}`, '_blank');
  }

  twitterShare() {
    const url = 'https://twitter.com/intent/tweet?text=Check%20out%20this%20Plebeian%20post!';

    window.open(url, '_blank');
  }

}
