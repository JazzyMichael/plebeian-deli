import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { switchMap, tap, debounceTime, first } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { CategoriesService } from '../services/categories.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { ChatService } from '../services/chat.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user$: Observable<any>;
  user: any;
  uid: string;
  editable: boolean;
  editing: boolean = false;
  doneLoading: boolean;
  categories: any[];
  update$: Subject<any> = new Subject();
  galleries$: Observable<any>;
  newUsername: string;

  userSub: Subscription;
  updateSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    public userService: UserService,
    private storage: AngularFireStorage,
    private catService: CategoriesService,
    private chatService: ChatService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const username = params.get('username');
        if (!username) return this.router.navigateByUrl('/about');
        // this.editing = false;

        return this.auth.getUser(username).pipe(
          tap((user: any) => {
            if (!user) return this.router.navigateByUrl('/about');
            this.editable = user.username === this.auth.username;
            this.titleService.setTitle(user.username);
            this.user = user;
            console.log(user);
            this.uid = user.uid || null;
            this.galleries$ = this.userService.getUserGalleries(this.uid);
          })
        );
      })
    );

    this.auth.user$.subscribe(user => {
      if (user && user.uid === this.uid) {
        this.editable = true;
      }
    });

    setTimeout(() => {
      this.doneLoading = true;
    }, 1111);

    this.categories = this.catService.getCategories();

    this.update$.pipe(debounceTime(1000)).subscribe(userObj => {
      this.userService.updateUser(this.uid, userObj);
      if (userObj.username) {
        this.router.navigateByUrl(`/${userObj.username}`);
        this.newUsername = '';
      }
    });
  }

  ngOnDestroy() {
    try {
      if (this.updateSub) {
        this.updateSub.unsubscribe();
      }
    } catch (e) {
      console.log('unsub', e);
    }
  }

  toggleEditing() {
    this.editing = !this.editing;
  }

  updateUserMedium(event: any) {
    const medium = event.value.toLowerCase();
    this.userService.updateUser(this.uid, { medium });
  }

  onLocationInput(location: string) {
    this.update$.next({ location });
  }

  openInstagram(instagram: string) {
    const url = `https://www.instagram.com/${instagram}`;
    window.open(url, '_blank');
  }

  openFacebook(facebookUrl: string) {
    window.open(facebookUrl, '_blank');
  }

  openOtherLink(otherLink: string) {
    window.open(otherLink, '_blank');
  }

  onUpdateUsername(username: string) {
    this.newUsername = username;
  }

  saveNewUsername() {
    this.update$.next({ username: this.newUsername });
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

    if (!this.uid || !file.type.split('/')[1]) {
      console.log('NO UID or file type');
      return;
    }

    console.log('file type: ', file.type);

    const fileType = file.type.split('/')[1];

    const path = `profile-pictures/${this.uid}.${fileType}`;

    const ref = this.storage.ref(path);

    await ref.put(file, { customMetadata: { username: this.user.username } });

    ref.getDownloadURL().subscribe(url => {
      this.userService.updateUser(this.uid, { profileUrl: url, profileType: fileType });
    });
  }

  async uploadBackgroundPic(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('images only bro');
      return;
    }

    if (!this.uid || !file.type.split('/')[1]) {
      console.log('NO UID or file type');
      return;
    }

    const fileType = file.type.split('/')[1];

    const path = `profile-backgrounds/${this.uid}.${fileType}`;

    const ref = this.storage.ref(path);

    await ref.put(file);

    ref.getDownloadURL().subscribe(url => {
      this.userService.updateUser(this.uid, { backgroundUrl: url, backgroundType: fileType });
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
