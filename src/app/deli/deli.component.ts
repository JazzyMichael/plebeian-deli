import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { CategoriesService } from '../services/categories.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { Subject, Subscription } from 'rxjs';

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
    const allCategory = { name: 'all', icon: 'all_inclusive' };
    this.cats = [ allCategory, ...this.catService.getCategories()];
    this.category = this.cats[0] ? this.cats[0].name : 'sculpture';
    this.titleService.setTitle('Deli');
  }

  unSub() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
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
