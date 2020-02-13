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
import { ServiceService } from '../services/service.service';
import { EventService } from '../services/event.service';

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
  categories: any[];
  galleries$: Observable<any>;
  services$: Observable<any[]>;
  events$: Observable<any[]>;
  newUsername: string;
  services: any[] = [1, 2, 3, 4, 5];

  userSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    public userService: UserService,
    private storage: AngularFireStorage,
    private catService: CategoriesService,
    private chatService: ChatService,
    public serviceService: ServiceService,
    public eventService: EventService
  ) { }

  ngOnInit() {
    this.user$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const username = params.get('username');
        if (!username) return this.router.navigateByUrl('/about');

        return this.auth.getUser(username).pipe(
          tap((user: any) => {
            if (!user) return this.router.navigateByUrl('/about');
            this.editable = user.username === this.auth.username;
            this.user = user;
            console.log(user);
            this.uid = user.uid || null;
            this.services$ = this.serviceService.getUserServices(this.uid);
            this.events$ = this.eventService.getUserEvents(this.uid);
            this.galleries$ = this.userService.getUserGalleries(this.uid);
          })
        );
      })
    );

    this.userSub = this.auth.user$.subscribe(user => {
      if (user && user.uid === this.uid) {
        this.editable = true;
      }
    });

    this.categories = this.catService.getCategories();
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  toggleEditing() {
    this.editing = !this.editing;
  }

  onLocationInput(location: string) {
    console.log(location);
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

  async initiateChat(userToChat: any) {
    const loggedInUser = await this.auth.getCurrentUser();

    if (!loggedInUser || loggedInUser.uid === userToChat.uid) {
      window.alert('Must be signed in to send a message, sign up for free!');
      return;
    }

    this.chatService.initiateChat(loggedInUser.uid, userToChat.uid);

    this.router.navigateByUrl('/chat');
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
