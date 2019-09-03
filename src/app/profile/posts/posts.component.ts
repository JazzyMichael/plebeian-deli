import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';

import Quill from 'quill';
import { AngularFireStorage } from '@angular/fire/storage';
import { debounceTime } from 'rxjs/operators';
// import ImageResize from 'quill-image-resize-module';
// Quill.register('modules/imageResize', ImageResize);

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
  editingPost: any;

  update$: Subject<any> = new Subject();
  updateSub: Subscription;
  quillEditorRef: any;
  firstImageUrl: string;

  constructor(
    private router: Router,
    private storage: AngularFireStorage,
    private postService: PostService,
    private userService: UserService) { }

  ngOnInit() {
    this.posts$ = this.postService.getUserPosts(this.user.uid);
  }

  startNewPost() {
    this.editing = true;
    this.editingPost = null;
  }

  cancelNewPost() {
    this.editing = false;
    this.editingPost = null;
  }

  editPost(post: any) {
    this.editing = true;
    this.editingPost = post;
    console.log(post);
  }

  async submitPost(event: any) {
    console.log('submitPost', event);

    const post = { ...event, userId: this.user.uid };

    if (this.editingPost) {
      this.postService
        .updatePost(this.editingPost.postId, post)
        .then(res => console.log('update post', res));
    } else {
      this.postService
        .createPost(post)
        .then(res => console.log('create post', res));
    }

    this.editing = false;
  }

  viewPost(postId: string) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

}
