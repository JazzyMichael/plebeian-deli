import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PrimeCutsService } from '../services/prime-cuts.service';
import { Title } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-prime-post',
  templateUrl: './prime-post.component.html',
  styleUrls: ['./prime-post.component.scss']
})
export class PrimePostComponent implements OnInit {
  primePost$: Observable<any>;
  userPrimePosts$: Observable<any>;
  alreadyLiked: boolean = false;
  postId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private primeCutsService: PrimeCutsService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postId = params.get('id');
      this.postId = postId;
      if (!postId) {
        return this.router.navigateByUrl('/prime-cuts');
      }

      document.querySelector('.main-container').scrollTop = 0;

      this.primePost$ = this.primeCutsService.getPrimePost(postId)
        .pipe(
          tap(post => {
            if (post && post.title) {
              this.titleService.setTitle(post.title);
            }
          })
        );
    });
  }

  likePost() {
    this.alreadyLiked = !this.alreadyLiked;
  }

  facebookShare() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=plebeiandeli.art/post/${this.postId}`, '_blank');
  }

}
