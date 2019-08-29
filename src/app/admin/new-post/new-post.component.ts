import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  postTitle: string;
  postImage: any;
  postImagePreview: any;
  postContent: any;
  featureFriday: boolean;
  modules: any = {};
  user: any;

  constructor(
    private storage: AngularFireStorage,
    private afStore: AngularFirestore,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.user = await this.authService.user$.pipe(first()).toPromise();
    console.log(this.user);
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
    const random = Math.random().toString().slice(2, 10);

    const userId = this.user.uid;

    const path = `prime-cuts-pictures/${userId}-${random}`;

    const ref = this.storage.ref(path);

    await this.storage.upload(path, this.postImage);

    const url = await ref.getDownloadURL().toPromise();

    const post = {
      userId,
      title: this.postTitle,
      content: this.postContent,
      featureFriday: this.featureFriday,
      thumbnailUrl: url,
      createdTimestamp: new Date()
    };

    this.createPost(post)
      .then(res => {
        this.postTitle = '';
        this.postContent = null;
        this.postImage = null;
        this.postImagePreview = null;
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
