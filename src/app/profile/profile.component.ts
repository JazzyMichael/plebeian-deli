import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { switchMap, tap, debounceTime, first } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UserService } from '../services/user.service';
import { CategoriesService } from '../services/categories.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<any>;
  uid: string;
  editable: boolean;
  doneLoading: boolean;
  categories: any[];
  update$: Subject<any> = new Subject();
  galleries$: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    public userService: UserService,
    private storage: AngularFireStorage,
    private catService: CategoriesService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const username = params.get('username');
        if (!username) return this.router.navigateByUrl('/about');

        return this.auth.getUser(params.get('username')).pipe(
          tap((user: any) => {
            if (!user) return this.router.navigateByUrl('/about');
            this.editable = user.username === this.auth.username;
            this.uid = user.uid || null;
            this.galleries$ = this.userService.getUserGalleries(this.uid);
          })
        );
      })
    );

    setTimeout(() => {
      this.doneLoading = true;
    }, 1111);

    this.categories = this.catService.getCategories();

    this.update$.pipe(debounceTime(1000)).subscribe(userObj => {
      this.userService.updateUser(this.uid, userObj);
      console.log(userObj);
    });

  }

  updateDescription(description: string) {
    this.userService.updateUser(this.uid, { description });
  }

  updateUserMedium(event: any) {
    const medium = event.value.toLowerCase();
    this.userService.updateUser(this.uid, { medium });
  }

  onLocationInput(location: string) {
    this.update$.next({ location });
  }

  onInstagramInput(instagram: string) {
    this.update$.next({ instagram });
  }

  openInstagram(instagram: string) {
    console.log(`instagram.com/${instagram}`);
  }

  onFacebookInput(facebook: string) {
    this.update$.next({ facebook });
  }

  openFacebook(facebook: string) {
    console.log(facebook);
  }

  onOtherLinkInput(otherLink: string) {
    this.update$.next({ otherLink });
  }

  openOtherLink(otherLink: string) {
    console.log(otherLink);
  }

  async initiateChat(userToChat: any) {
    const loggedInUser = await this.auth.user$.pipe(first()).toPromise();

    if (!loggedInUser || loggedInUser.uid === userToChat.uid) {
      window.alert('Must be signed in to send a message, sign up for free!');
      return;
    }

    this.chatService.initiateChat(loggedInUser.uid, userToChat.uid);
  }

  async uploadProfilePic(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('Only Images are allowed for profile picture');
      return;
    }

    const path = `profile-pictures/${this.uid}`;

    const ref = this.storage.ref(path);

    await this.storage.upload(path, file);

    ref.getDownloadURL().subscribe(url => {
      this.userService.updateUser(this.uid, { profileUrl: url });
    });
  }

  async uploadCv(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'application') {
      console.log('Only PDF\'s are allowed for CV');
      return;
    }

    const path = `cvs/${this.uid}`;

    const ref = this.storage.ref(path);

    await this.storage.upload(path, file);

    ref.getDownloadURL().subscribe(url => {
      this.userService.updateUser(this.uid, { cv: url });
    });
  }

}
