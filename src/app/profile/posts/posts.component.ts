import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Quill from 'quill';

import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  @Input() user: any;
  @Input() editable: boolean;
  @Input() categories: any[];

  posts$: Observable<any>;
  editing: boolean;
  postTitle: string;
  postContent: any;
  postCategory: string;
  content: any;
  modules: any = {
    imageResize: {}
  };

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    this.posts$ = this.userService.getPosts(this.user.uid);
  }

  onEditorCreated(event: any) {
    console.log('onEditorCreated', event);
  }

  submitPost() {
    this.editing = false;

    this.userService.addPost(this.user.uid, this.postTitle, this.postCategory, this.postContent)
      .then(res => {
        this.postTitle = '';
        this.postCategory = null;
        this.postContent = null;
      })
      .catch(e => console.log('error adding post', e));
  }

  viewPost(post: any) {
    this.router.navigateByUrl(`/post/${post.title}`);
  }

}
