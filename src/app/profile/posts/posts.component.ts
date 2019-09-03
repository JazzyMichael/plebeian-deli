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
  }

  deletePost(post: any) {
    this.postService.deletePost(post.postId)
      .then(() => console.log('deleted'))
      .catch(e => console.log('error deleting', e));
  }

  async submitPost(event: any) {

    const post = { ...event, userId: this.user.uid };

    if (this.editingPost) {
      console.log('update');
      this.postService
        .updatePost(this.editingPost.postId, post)
        .then(res => console.log('updated post', res))
        .catch(e => console.log('error updating post', e));
    } else {
      this.postService
        .createPost(post)
        .then(res => console.log('created post', res))
        .catch(e => console.log('error creating post', e));
    }

    this.editing = false;
  }

  viewPost(postId: string) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

}
