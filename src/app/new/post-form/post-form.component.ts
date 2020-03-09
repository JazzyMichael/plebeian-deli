import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostService } from 'src/app/services/post.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {
  uploading: boolean;
  post: any;
  postForm: FormGroup;
  images: any[] = [];
  tags: string[] = [];
  thumbnailImgUrl: string;
  catOptions: string[];
  approvedSeller: boolean;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cats: CategoriesService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.catOptions = this.cats.getCategoryNames();

    this.post = this.postService.editingPost || {};

    this.createPostForm();

    if (this.post.title) {
      this.postForm.setValue({
        title: this.post.title,
        category: this.post.category,
        description: this.post.description,
        link: this.post.link,
        thumbnailImgUrl: this.post.thumbnailImgUrl,
        price: this.post.price,
        shipping: this.post.shipping,
        quantity: this.post.quantity
      });
      this.images = this.post.images;
      this.thumbnailImgUrl = this.post.thumbnailImgUrl;
      this.tags = this.post.tags;
    }
  }

  ngOnDestroy(): void {
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
      this.snackBar.open('Only Images Are Allowed!', '', { duration: 4000 });
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

  addTag(event: MatChipInputEvent): void {
    const { input, value } = event;

    if (value || '') {
      this.tags.push(value);

      if (this.tags.length > 10) {
        this.tags = this.tags.slice(this.tags.length - 10);
      }
    }

    if (input) {
      input.value = '';
    }

    this.snackBar.open('Tag added!', '', { duration: 2000 });
  }

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.snackBar.open('Tag removed!', '', { duration: 2000 });
    }
  }

  async submit() {
    this.uploading = true;

    let thumbnailIndex = this.images.findIndex(i => i.url === this.thumbnailImgUrl);

    if (!thumbnailIndex || thumbnailIndex < 0) {
      thumbnailIndex = 0;
    }

    const postImgObj = await this.postService.savePostImages(this.images, thumbnailIndex);

    const fullObj = {
      ...this.postForm.value,
      ...postImgObj,
      lowerCaseTitle: this.postForm.value.title.toLowerCase(),
      tags: this.tags.map(tag => tag.trim().toLowerCase())
    };

    try {
      let docRef: any;

      if (this.postService.editingPost) {
        const editingPostId = this.postService.editingPost.postId;
        docRef = { id: editingPostId };
        await this.postService.updatePost(editingPostId, {
          ...fullObj,
          updatedTimestamp: new Date()
        });
      } else {
        docRef = await this.postService.createPost({
          ...fullObj,
          createdTimestamp: new Date(),
          likes: 0
        });
      }

      this.postForm.reset();
      this.postService.editingPost = null;
      this.snackBar.open('Post Added to the Deli!', '', { duration: 3000 });
      this.router.navigateByUrl(`/post/${docRef.id}`);

    } catch (e) {
      console.log(e);
      this.snackBar.open('Oops! Something went wrong, try again later.', 'Ok');
      this.uploading = false;
      this.postService.editingPost = null;
      this.postForm.reset();
    }
  }

  // quantityOptions: number[] = [
  //   1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  // ];

  // validatePrice$: Subject<any> = new Subject();

  // this.validatePrice$
  //     .pipe(debounceTime(777))
  //     .subscribe(() => {
  //       if (this.price) {
  //         let chars = this.price.split('');

  //         chars = chars.filter(c => {
  //           if (
  //             c === '1' ||
  //             c === '2' ||
  //             c === '3' ||
  //             c === '4' ||
  //             c === '5' ||
  //             c === '6' ||
  //             c === '7' ||
  //             c === '8' ||
  //             c === '9' ||
  //             c === '0'
  //           ) {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         });

  //         this.price = chars.join('');
  //       }
  //     });

  // priceInput() {
  //   this.validatePrice$.next();
  // }

}
