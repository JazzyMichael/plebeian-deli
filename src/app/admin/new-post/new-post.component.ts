import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-and-rotate-module';
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit, OnDestroy {
  postTitle: string;
  postImage: any;
  postImagePreview: any;
  postContent: any;
  featureFriday: boolean = false;
  modules: any = {
    toolbar: {
      container: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image']
      ]
    },
    imageResize: true
  };
  user: any;
  quillEditorRef;
  firstImageUrl: string;
  posterUid: string = 'cZAJAT0Th3Qu4M91Jc2MFqMxsls1';
  uSub: Subscription;

  constructor(
    private storage: AngularFireStorage,
    private afStore: AngularFirestore,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.uSub = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    try {
      this.uSub.unsubscribe();
    } catch (e) { }
  }

  getEditorInstance(inst: any) {
    this.quillEditorRef = inst;
    console.log(this.quillEditorRef);
    const toolbar = inst.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

  imageHandler = (image, callback) => {
    console.log('image', image);
    const input: any = document.getElementById('quillImageField');
    document.getElementById('quillImageField').onchange = async () => {
      let file: File;
      file = input.files[0];
      // file type is only image.
      if (/^image\//.test(file.type)) {
        if (file.size > 10000000) {
          alert('Image needs to be less than 1MB');
        } else {
          // upload to firebase
          const random = Math.random().toString().slice(2, 10);

          const userId = 'blahblahblah'; // this.user.uid;

          const path = `prime-cuts-pictures/${userId}-${random}`;

          const ref = this.storage.ref(path);

          await this.storage.upload(path, file);

          const url = await ref.getDownloadURL().toPromise();

          if (!this.firstImageUrl) {
            this.firstImageUrl = url;
          }

          const range = this.quillEditorRef.getSelection();

          const qImg = `<img src="${url}" />`;

          this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, qImg);

        }
      } else {
          alert('You could only upload images.');
      }
    };

    input.click();
  }

  uploadPostImage(event: any) {
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
    // const random = Math.random().toString().slice(2, 10);

    const userId = this.user ? this.user.uid : 'potato';

    const post = {
      userId: this.posterUid,
      title: this.postTitle,
      content: this.postContent,
      featureFriday: this.featureFriday,
      thumbnailUrl: this.firstImageUrl || '',
      createdTimestamp: new Date()
    };

    this.createPost(post)
      .then(res => {
        this.postTitle = '';
        this.postContent = null;
        this.postImage = null;
        this.firstImageUrl = null;
        this.featureFriday = false;
      })
      .catch(e => console.log('error adding post', e));
  }

  createPost(post: any) {
    return this.afStore
      .collection('prime-cuts')
      .add(post);
  }

}
