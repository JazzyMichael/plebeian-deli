import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  post$: Observable<any>;
  recentPosts$: Observable<any>;

  postId: string;
  postUserId: string;
  canPurchase: boolean;
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
    private notificationService: NotificationService,
    private snackbar: MatSnackBar
  ) { }

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

      if (this.user) this.canPurchase = this.isTester(this.user.uid);

      this.post$ = this.postService.getPost(postId)
        .pipe(
          tap(post => {
            if (!post) {
              return this.router.navigateByUrl('/deli');
            }

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

            this.recentPosts$ = this.postService.getRecentPosts(4);
          })
        );
    });

    this.debounceSub = this.likeDebouncer
      .pipe(debounceTime(1111))
      .subscribe(async x => {
        if (x) {
          // liked

          if (this.likedUids.some(uid => uid === this.user.uid)) {
            // already liked
            return;
          }

          this.likedUids.push(this.user.uid);
          await this.postService.updatePost(this.postId, { likedUids: this.likedUids, likes: this.likedUids.length });
          this.snackbar.open('Liked :)', '', { duration: 2500 });

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

          const likedUids = this.likedUids.filter(uid => uid !== this.user.uid);
          if (likedUids.length === this.likedUids.length) {
            // already unliked
            return;
          }

          await this.postService.updatePost(this.postId, { likedUids, likes: likedUids.length });
          this.snackbar.open('Unliked :(', '', { duration: 2500 });
        }
      });
  }

  ngOnDestroy() {
    if (this.debounceSub) this.debounceSub.unsubscribe();
  }

  async likePost() {
    // if not signed in show popup
    if (!this.user) {
      alert('Log in to Like Posts!');
      return;
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

  isTester(uid: string) {
    return [
      'raKDGj7QGwMpGlED5JQRVDSQZ983',
      'Yg1KGgr6HCUjI1kvdVjlXujwJ7Z2',
      'cZAJAT0Th3Qu4M91Jc2MFqMxsls1',
      'kCmmJ90ZibOW7KrmG27lxYYqnN93'
    ].includes(uid);
  }

}
