import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { CategoriesService } from '../services/categories.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-deli',
  templateUrl: './deli.component.html',
  styleUrls: ['./deli.component.scss']
})
export class DeliComponent implements OnInit {
  cats: any[];
  carouselIndex = 0;
  infinite = true;
  category: string;

  userSub: Subscription;
  debounceSub: Subscription;
  noUserDebouncer: Subject<boolean> = new Subject();

  constructor(
    public postService: PostService,
    private catService: CategoriesService,
    private router: Router,
    private titleService: Title,
    private authService: AuthService
    ) { }

  async ngOnInit() {
    this.cats = this.catService.getCategories();
    this.category = this.cats[0] ? this.cats[0].name : 'sculpture';
    this.titleService.setTitle('Deli - Plebeian');

    // this.debounceSub = this.noUserDebouncer.pipe(debounceTime(2000)).subscribe(bool => {
    //   this.unSub();
    //   if (bool) {
    //     // no user
    //     window.alert('Login to view posts in the Deli!');

    //     return this.router.navigateByUrl('/login');
    //   }
    // });

    // this.userCheck();
  }

  // userCheck() {
  //   this.userSub = this.authService.user$.subscribe(user => {
  //     if (!user) {
  //       this.noUserDebouncer.next(true);
  //     } else {
  //       this.noUserDebouncer.next(false);
  //     }
  //   });
  // }

  unSub() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    // if (this.debounceSub) {
    //   this.debounceSub.unsubscribe();
    // }
  }

  categorySelect(index: number) {
    this.carouselIndex = index;
    this.category = this.cats[index].name;
  }

  carouselIndexChanged(index: number) {
    this.carouselIndex = index;
    this.category = this.cats[index].name;
  }

  postClick(postId: string) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

}
