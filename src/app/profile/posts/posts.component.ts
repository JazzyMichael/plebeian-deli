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
  postTitle: string;
  postContent: any;
  postCategory: string;
  postImage: any;
  postImagePreview: any;
  content: any;
  modules: any = {
    // imageResize: {}
  };
  quantityArr: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];
  quantity: number = 1;
  price: string = '';

  update$: Subject<any> = new Subject();
  updateSub: Subscription;

  constructor(
    private router: Router,
    private storage: AngularFireStorage,
    private postService: PostService,
    private userService: UserService) { }

  ngOnInit() {
    this.posts$ = this.postService.getUserPosts(this.user.uid);

    this.update$.pipe(debounceTime(777)).subscribe(() => {
      if (this.price) {

        let chars = this.price.split('');

        chars = chars.filter(c => {
          if (
            c === '1' ||
            c === '2' ||
            c === '3' ||
            c === '4' ||
            c === '5' ||
            c === '6' ||
            c === '7' ||
            c === '8' ||
            c === '9' ||
            c === '0'
          ) {
            return true;
          } else {
            return false;
          }
        });

        this.price = chars.join('');

      }
    });
  }

  onEditorChanged(event: any) {
    return;
    // console.log('onEditorChanged', event);
  }

  priceInput(event: any) {
    this.update$.next();
    // setTimeout(() => {

    //   console.log('price start', JSON.stringify(this.price));
    //   console.log('event', event);
  
    //   if (
    //     event.data === '1' ||
    //     event.data === '2' ||
    //     event.data === '3' ||
    //     event.data === '4' ||
    //     event.data === '5' ||
    //     event.data === '6' ||
    //     event.data === '7' ||
    //     event.data === '8' ||
    //     event.data === '9' ||
    //     event.data === '0'
    //   ) {
    //     this.price += event.data;
    //   }
  
    //   if (event.inputType === 'deleteContentBackward') {
    //     this.price = this.price.substring(0, this.price.length - 1);
    //   }
  
    //   console.log('price end', JSON.stringify(this.price));

    // }, 500);

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

    let post = {
      userId: this.user.uid,
      title: this.postTitle,
      category: this.postCategory,
      content: this.postContent,
      thumbnailUrl: url,
      createdTimestamp: new Date()
    };

    if (this.user.approvedSeller) {
      post['quantity'] = this.quantity;
      post['startingQuantity'] = this.quantity;
      post['price'] = this.price ? parseInt(this.price) : undefined;
    }

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
