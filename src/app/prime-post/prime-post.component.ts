import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { PrimeCutsService } from '../services/prime-cuts.service';
import { Title } from '@angular/platform-browser';
import { tap, debounceTime } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-prime-post',
  templateUrl: './prime-post.component.html',
  styleUrls: ['./prime-post.component.scss']
})
export class PrimePostComponent implements OnInit {
  primePost$: Observable<any>;
  userPrimePosts$: Observable<any>;
  postId: string;
  postUserId: string;

  likedUids: string[];
  alreadyLiked: boolean;
  likeCount: number;
  likeDebouncer: Subject<any> = new Subject();
  debounceSub: Subscription;

  user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private primeCutsService: PrimeCutsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postId = params.get('id');

      if (!postId) {
        return this.router.navigateByUrl('/prime-cuts');
      }

      this.postId = postId;

      document.querySelector('.mat-drawer-content').scrollTop = 0;

      document.querySelector('.mat-sidenav-content').scrollTop = 0;

      this.user = await this.authService.getCurrentUser();

      this.primePost$ = this.primeCutsService.getPrimePost(postId)
        .pipe(
          tap(post => {
            if (!post) {
              return this.router.navigateByUrl('/prime-cuts');
            }

            if (post.title) {
              this.titleService.setTitle(post.title);
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
          })
        );
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
          this.primeCutsService.updatePrimeCut(this.postId, { likedUids: this.likedUids })
            .then(res => console.log('post likes updated', res));
          // update post user notifications
          const obj = {
            userId: this.user.uid,
            username: this.user.username,
            createdTimestamp: new Date(),
            primePostId: this.postId,
            new: true,
            type: 'like',
            postThumnailUrl: ''
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

          this.primeCutsService.updatePrimeCut(this.postId, { likedUids })
            .then(res => console.log('post likes updated', res));
        }
      });
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

  facebookShare() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=plebeiandeli.art/post/${this.postId}`, '_blank');
  }

  twitterShare() {
    const url = 'https://twitter.com/intent/tweet?text=Check%20out%20this%20Plebeian%20post!';

    window.open(url, '_blank');
  }

  deletePost() {
    // this.primeCutsService.deletePrimeCut(this.postId);
  }

}
