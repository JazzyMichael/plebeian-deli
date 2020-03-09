import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-deli',
  templateUrl: './deli.component.html',
  styleUrls: ['./deli.component.scss']
})
export class DeliComponent implements OnInit {

  posts$: Observable<any>;
  category: string = 'all';
  sort: string = 'recent';
  searchTerm: string = '';

  constructor(
    public postService: PostService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getPosts();
  }

  openSidenav() {
    this.auth.toggleSidenav.next(true);
  }

  search(term: string) {
    if (this.searchTerm === term) return;
    this.searchTerm = term;
    this.getPosts();
  }

  categorySelect(cat: string) {
    if (this.category === cat) return;
    this.category = cat;
    this.getPosts();
  }

  sortChange(sort: string) {
    if (this.sort === sort) return;
    this.sort = sort;
    this.getPosts();
  }

  getPosts() {
    if (this.searchTerm) {

      this.posts$ = this.postService.searchPosts(this.searchTerm.toLowerCase())
        .pipe(
          map((posts: any[] = []) => {
            if (this.category === 'all') return posts;
            return posts.filter(post => {
              return post.category === this.category;
            });
          }),
          map((posts: any[] = []) => {
            const opts = { recent: 'createdTimestamp', popular: 'likes', price: 'price' };
            const sortField = opts[this.sort];
            return posts.sort((a, b) => b[sortField] - a[sortField]);
          }),
          tap(posts => console.log('searchTerm posts', posts))
        )

    } else if (this.category && this.category !== 'all') {

      this.posts$ = this.postService.getPostsByCategoryNEW(this.category)
        .pipe(
          map((posts: any[] = []) => {
            const opts = { recent: 'createdTimestamp', popular: 'likes', price: 'price' };
            const sortField = opts[this.sort];
            return posts.sort((a, b) => b[sortField] - a[sortField]);
          }),
          tap(posts => console.log('category posts', posts))
        );

    } else {

      const opts = { recent: 'createdTimestamp', popular: 'likes', price: 'price' };
      const sortField = opts[this.sort];
      this.posts$ = this.postService.getSortedPosts(sortField).pipe(
        tap(posts => console.log('sort posts', posts))
      );

    }
  }

}
