import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';

import Quill from 'quill';
import { AngularFireStorage } from '@angular/fire/storage';
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
  postTitle: string;
  postContent: any;
  postCategory: string;
  postImage: any;
  postImagePreview: any;
  content: any;
  modules: any = {
    // imageResize: {}
  };

  constructor(
    private router: Router,
    private storage: AngularFireStorage,
    private postService: PostService,
    private userService: UserService) { }

  ngOnInit() {
    this.posts$ = this.postService.getUserPosts(this.user.uid);
  }

  onEditorChanged(event: any) {
    return;
    // console.log('onEditorChanged', event);
  }

  uploadPostPic(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('Only Images are allowed for profile picture');
      return;
    }

    this.postImage = file;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.postImagePreview = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  async submitPost() {
    this.editing = false;

    const random = Math.random().toString().slice(2, 10);

    const path = `post-pictures/${this.user.uid}-${random}`;

    const ref = this.storage.ref(path);

    await this.storage.upload(path, this.postImage);

    const url = await ref.getDownloadURL().toPromise();

    const post = {
      userId: this.user.uid,
      title: this.postTitle,
      category: this.postCategory,
      content: this.postContent,
      thumbnailUrl: url,
      createdTimestamp: new Date()
    };

    this.postService.createPost(post)
      .then(res => {
        this.postTitle = '';
        this.postCategory = null;
        this.postContent = null;
        this.postImage = null;
        this.postImagePreview = null;
      })
      .catch(e => console.log('error adding post', e));
  }

  viewPost(postId: string) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

}
