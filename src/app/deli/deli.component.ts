import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-deli',
  templateUrl: './deli.component.html',
  styleUrls: ['./deli.component.scss']
})
export class DeliComponent implements OnInit {

  posts$: Observable<any>;

  constructor(
    public postService: PostService,
    private titleService: Title
    ) { }

  async ngOnInit() {
    this.titleService.setTitle('Deli');

    this.getPostsByCategory('all');
  }

  getPostsByCategory(category: string) {
    this.posts$ = category && category !== 'all'
                ? this.postService.getPostsByCategory(category)
                : this.postService.posts$;
  }

}
