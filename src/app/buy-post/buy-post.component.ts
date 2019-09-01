import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-buy-post',
  templateUrl: './buy-post.component.html',
  styleUrls: ['./buy-post.component.scss']
})
export class BuyPostComponent implements OnInit {
  post$: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const postId = params.get('id');

      if (!postId) {
        return this.router.navigateByUrl('/deli');
      }

      document.querySelector('.main-container').scrollTop = 0;

      this.post$ = this.postService.getPost(postId)
        .pipe(
          tap(post => {
            if (!post) {
              return this.router.navigateByUrl('/deli');
            }

            if (!post.quantity) {
              return window.alert('This art just sold out!');
            }
          })
        );
    });
  }

}
