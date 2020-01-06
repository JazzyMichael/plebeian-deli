import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { CategoriesService } from '../services/categories.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { PostService } from '../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit, OnDestroy {

  post: any;

  approvedSeller: boolean;

  postForm: FormGroup;
  images: any[] = [];
  thumbnailImgUrl: string;

  categoryOptions: string[];
  quantityOptions: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ];

  validatePrice$: Subject<any> = new Subject();

  uploading: boolean;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: any[] = [];

  editingPost: any;

  user: any;

  constructor(
    private categoriesService: CategoriesService,
    private storage: AngularFireStorage,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private postService: PostService,
    private auth: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.categoryOptions = this.categoriesService.getCategories().map(cat => cat.name);

    this.createPostForm();

    this.user = await this.auth.getCurrentUser();

    this.post = this.postService.editingPost || {};

    // this.validatePrice$
    //   .pipe(debounceTime(777))
    //   .subscribe(() => {
    //     if (this.price) {
    //       let chars = this.price.split('');

    //       chars = chars.filter(c => {
    //         if (
    //           c === '1' ||
    //           c === '2' ||
    //           c === '3' ||
    //           c === '4' ||
    //           c === '5' ||
    //           c === '6' ||
    //           c === '7' ||
    //           c === '8' ||
    //           c === '9' ||
    //           c === '0'
    //         ) {
    //           return true;
    //         } else {
    //           return false;
    //         }
    //       });

    //       this.price = chars.join('');
    //     }
    //   });
  }

  ngOnDestroy() {
    this.postService.editingPost = null;
  }

  createPostForm() {
    this.postForm = this.fb.group({
      title: [this.post ? this.post.title : '', Validators.required],
      category: [this.post ? this.post.category : '', Validators.required],
      description: [this.post ? this.post.category : ''],
      link: [this.post ? this.post.link : ''],
      thumbnailImgUrl: [this.post ? this.post.thumbnailImgUrl : '', Validators.required],
      price: [this.post ? this.post.price : ''],
      shipping: [this.post ? this.post.shipping : ''],
      quantity: [this.post ? this.post.quantity : '']
    });
  }

  addImage(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      window.alert('Only Image files are allowed');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.images.push({ file, url: e.target.result });
      if (this.images.length === 1) {
        this.thumbnailImgUrl = this.images[0].url;
        this.postForm.patchValue({ thumbnailImgUrl: this.thumbnailImgUrl });
      }
    };

    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    let flag: boolean;

    if (this.thumbnailImgUrl === this.images[index].url) {
      flag = true;
    }

    this.images.splice(index, 1);

    if (flag) {
      this.thumbnailImgUrl = this.images.length ? this.images[0].url : null;
    }

    if (!this.images.length) {
      this.thumbnailImgUrl = null;
      this.postForm.patchValue({ thumbnailImgUrl: this.thumbnailImgUrl });
    }
  }

  setThumbnail(imgUrl: string) {
    this.thumbnailImgUrl = imgUrl;
  }

  priceInput() {
    // this.validatePrice$.next();
  }

  addTag(event: MatChipInputEvent): void {
    const { input, value } = event;

    if ((value || '').trim()) {
      this.tags.push(value);

      if (this.tags.length > 10) {
        this.tags = this.tags.slice(this.tags.length - 10);
      }
    }

    if (input) {
      input.value = '';
    }

    this.snackBar.open('Tag added!', 'Ok', { duration: 2000 });
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.snackBar.open('Tag removed!', 'Ok', { duration: 2000 });
    }
  }

  async submit() {

    if (!this.user) {
      this.user = await this.auth.getCurrentUser();
      if (!this.user) {
        return;
      }
    }

    this.uploading = true;

    const postImages = [];

    const thumbnailIndex = this.images.findIndex(i => i.url === this.thumbnailImgUrl);

    for await (let img of this.images) {

      if (!img.file && img.url) {
        postImages.push(img);
      } else {
        const random = Math.random().toString().slice(0, 8);

        const fileType = img.file.type.split('/')[1];

        const path = `deli-pictures/${random}`;

        const ref = this.storage.ref(path);

        await this.storage.upload(path, img.file);

        const url = await ref.getDownloadURL().toPromise();

        const thumbPath = `deli-pictures/thumbnails/0_500x500.${random.substring(2)}`;

        postImages.push({ url, thumbPath });
      }
    }

    const postObj = {
      ...this.postForm.value,
      images: postImages,
      thumbnailPath: postImages[thumbnailIndex].thumbPath,
      thumbnailImgUrl: postImages[thumbnailIndex].url,
      startingQuantity: this.postForm.value.quantity,
      likes: 0,
      tags: this.tags || [],
      userId: this.user.uid
    };

    try {
      let docRef;

      if (this.postService.editingPost) {
        const editingPostId = this.postService.editingPost.postId;
        await this.postService.updatePost(editingPostId, postObj);
        docRef = { id: editingPostId };
        this.snackBar.open('Post Updated!', 'Ok', { duration: 3000 });
      } else {
        postObj.createdTimestamp = new Date();
        docRef = await this.postService.createPost(postObj);
        this.snackBar.open('Posted!', 'Ok', { duration: 3000 });
      }

      this.uploading = false;

      this.postForm.reset();

      this.router.navigateByUrl(`/post/${docRef.id}`);

    } catch (e) {
      console.log(e);
      this.snackBar.open('Oops! Something went wrong, try again later.', 'Ok');

      this.uploading = false;

      this.postForm.reset();
    }
  }

}
