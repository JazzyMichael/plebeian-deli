import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PrimeCutsService } from '../services/prime-cuts.service';
import { AngularFireStorage } from '@angular/fire/storage';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-new-prime-post',
  templateUrl: './new-prime-post.component.html',
  styleUrls: ['./new-prime-post.component.scss']
})
export class NewPrimePostComponent implements OnInit, OnDestroy {
  category: string;
  ticketNumber: string = '';
  title: string = '';
  textPreview: string = '';
  thumbnailImage: any;
  postImages: any[] = [];
  content: any;

  userSub: Subscription;
  user: any;

  categoryOptions: any[] = [
    { displayName: 'Mood', propName: 'mood' },
    { displayName: 'Case Study', propName: 'case-study' },
    { displayName: 'Rant', propName: 'rant' },
    { displayName: 'Inverview', propName: 'interview' },
    { displayName: 'Feature Friday', propName: 'feature-friday' }
  ];

  quillEditorRef: any;

  quillModules: any = {
    toolbar: {
      container: [
        // [{ 'font': [] }],
        [{ 'size': [false, 'large', 'huge'] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }]
      ]
    },
    imageResize: true
  };

  constructor(
    private authService: AuthService,
    private primeCutsService: PrimeCutsService,
    private storage: AngularFireStorage
    ) { }

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  removeImage(index: number) {
    let flag = false;

    if (this.thumbnailImage === this.postImages[index]) {
      flag = true;
    }

    this.postImages.splice(index, 1);

    if (flag) {
      this.thumbnailImage = this.postImages.length ? this.postImages[0] : null;
    }
  }

  imageHandler = (image, callback) => {
    const input: any = document.getElementById('quillImageInput');
    document.getElementById('quillImageInput').onchange = async () => {
      const file: File = input.files[0];

      if (/^image\//.test(file.type)) {
        // upload to firebase
        const random = Math.random().toString().slice(2, 10);

        const userId = this.user.uid; // this.user.uid;

        const path = `prime-cuts-pictures/${userId}-${random}`;

        const ref = this.storage.ref(path);

        await this.storage.upload(path, file);

        const url = await ref.getDownloadURL().toPromise();

        if (!this.thumbnailImage) {
          this.thumbnailImage = url;
        }

        this.postImages.push(url);

        const range = this.quillEditorRef.getSelection();

        const qImg = `<img src="${url}" class="ql-align-center" />`;

        this.quillEditorRef.clipboard.dangerouslyPasteHTML(range.index, qImg);

        this.content = this.quillEditorRef.root.innerHTML;

      } else {
        window.alert('You can only upload images.');
      }
    };

    input.click();
  }

  onEditorCreated(event: any) {
    this.quillEditorRef = event;

    const toolbar = event.getModule('toolbar');

    toolbar.addHandler('image', this.imageHandler);
  }

  uploadImages(imgs: any[]) {
    return imgs;
  }

  selectThumbnail(url: string) {
    this.thumbnailImage = url;
  }

  submitPost() {
    const primePostObj = {
      category: this.category || '',
      ticketNumber: this.ticketNumber ? this.ticketNumber : '',
      title: this.title,
      textPreview: this.textPreview || '',
      thumbnailUrl: this.thumbnailImage || '',
      content: this.content,
      author: this.user.displayName,
      userId: this.user.uid,
      featureFriday: this.category === 'feature-friday' ? true : false,
      createdTimestamp: new Date()
    };

    this.primeCutsService.createPrimeCut(primePostObj)
      .then(res => {
        this.clearFields();
        window.alert('Posted');
        this.primeCutsService.getInitialPrimeCuts();
      });
  }

  clearFields() {
    this.category = '';
    this.ticketNumber = '';
    this.title = '';
    this.textPreview = '';
    this.thumbnailImage = '';
    this.content = '';
    this.postImages = [];
  }

}
