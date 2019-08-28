import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { CategoriesService } from '../services/categories.service';
import { Router } from '@angular/router';

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

  constructor(
    public postService: PostService,
    private catService: CategoriesService,
    private router: Router) { }

  ngOnInit() {
    this.cats = this.catService.getCategories();
    this.category = this.cats[0] ? this.cats[0].name : 'sculpture';
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
