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
  quillEditorRef: any;
  firstImageUrl: string;

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

    // setInterval(() => {
    //   console.log(this.quillEditorRef);
    // }, 5000);
  }

  startNewPost() {
    this.editing = true;
    // this.quillForm = new FormGroup({
    //   editor: new FormControl()
    // });
  }

  cancelNewPost() {
    this.editing = false;
    this.firstImageUrl = null;
    this.postTitle = null;
    this.postContent = null;
    this.postCategory = null;
    // console.log(this.quillForm.value);
    // this.quillForm.reset();
  }

  imageHandler = (image, callback) => {
    // console.log('image', image);
    const input: any = document.getElementById('quillImageField');
    document.getElementById('quillImageField').onchange = async () => {
      let file: File;
      file = input.files[0];
      // file type is only image.
      if (/^image\//.test(file.type)) {
        // upload to firebase
        const random = Math.random().toString().slice(2, 10);

        const userId = this.user.uid;

        const path = `post-pictures/${userId}-${random}`;

        const ref = this.storage.ref(path);

        await this.storage.upload(path, file);

        const url = await ref.getDownloadURL().toPromise();

        if (!this.firstImageUrl) {
          this.firstImageUrl = url;
        }

        const range = this.quillEditorRef.getSelection();

        const qImg = `<img src="${url}" style="display: block; margin: auto;" />`;

        this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, qImg);

        this.postContent = this.quillEditorRef.root.innerHTML;
      } else {
          window.alert('You can only upload images.');
      }
    };

    input.click();
  }

  onEditorCreated(inst: any) {
    // created
    this.quillEditorRef = inst;
    const toolbar = inst.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

  onEditorChanged(event: any) {
    console.log('onEditorChanged');
    if (!this.postContent && this.firstImageUrl) {
      // this.firstImageUrl = null;
      console.log('no content, yes thumbnail');
    }
  }

  priceInput(event: any) {
    this.update$.next();
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

    // const random = Math.random().toString().slice(2, 10);

    // const path = `post-pictures/${this.user.uid}-${random}`;

    // const ref = this.storage.ref(path);

    // await this.storage.upload(path, this.postImage);

    // const url = await ref.getDownloadURL().toPromise();

    let post = {
      userId: this.user.uid,
      title: this.postTitle,
      category: this.postCategory,
      content: this.postContent,
      thumbnailUrl: this.firstImageUrl || '',
      createdTimestamp: new Date(),
      likes: 0
    };

    if (this.user.approvedSeller) {
      if (this.quantity) post['quantity'] = this.quantity;
      if (this.quantity) post['startingQuantity'] = this.quantity;
      if (this.price) post['price'] = this.price ? parseInt(this.price) : 0;
    }

    this.postService.createPost(post)
      .then(res => {
        this.postTitle = '';
        this.postCategory = null;
        this.postContent = null;
        this.firstImageUrl = null;
        this.postImage = null;
        this.postImagePreview = null;
      })
      .catch(e => console.log('error adding post', e));
  }

  viewPost(postId: string) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

}
