import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-deli',
  templateUrl: './deli.component.html',
  styleUrls: ['./deli.component.scss']
})
export class DeliComponent implements OnInit {

  posts$: Observable<any>;
  category: string;
  sort: string;

  constructor(
    public postService: PostService,
    private auth: AuthService
    ) { }

  ngOnInit() {
    this.getPostsByCategory('all');
  }

  openSidenav() {
    this.auth.toggleSidenav.next(true);
  }

  getPostsByCategory(category: string) {
    if (this.category === category) {
      return;
    }
    this.category = category;
    this.posts$ = category && category !== 'all'
                ? this.postService.getPostsByCategory(this.category, this.sort)
                : this.postService.getAllPostsBySort(this.sort);
  }

  sortChange(sort: string) {
    if (this.sort === sort) {
      return;
    }
    this.sort = sort;
    this.posts$ = this.category && this.category !== 'all'
                ? this.postService.getPostsByCategory(this.category, this.sort)
                : this.postService.getAllPostsBySort(this.sort);
  }

  search(term: string) {
    this.posts$ = term
      ? this.postService.filterPostsByTag(term, this.sort)
      : this.postService.getAllPostsBySort(this.sort);
  }

}
