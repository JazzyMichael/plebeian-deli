import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
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
  services$: Observable<any[]>;
  events$: Observable<any[]>;
  userSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    public userService: UserService,
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
          tap(async (user: any) => {
            if (!user) return this.router.navigateByUrl('/about');
            console.log(user);
            this.user = user;
            this.uid = user.uid || null;
            const loggedInUser = await this.auth.getCurrentUser();
            this.editable = loggedInUser && loggedInUser.uid === this.uid;
            this.services$ = this.serviceService.getUserServices(this.uid);
            this.events$ = this.eventService.getUserEvents(this.uid);
          })
        );
      })
    );

    this.userSub = this.auth.user$.subscribe(user => {
      this.editable = user && user.uid === this.uid;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
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

  editService(service: any) {
    this.serviceService.editingService = service;
    this.router.navigateByUrl('/new/service');
  }

  editEvent(event: any) {
    this.eventService.editingEvent = event;
    this.router.navigateByUrl('/new/event');
  }

  async initiateChat(userToChat: any) {
    const loggedInUser = await this.auth.getCurrentUser();

    if (!loggedInUser || loggedInUser.uid === userToChat.uid) {
      alert('Must be signed in to send a message, sign up for free!');
      return;
    }

    this.chatService.initiateChat(loggedInUser.uid, userToChat.uid);

    this.router.navigateByUrl('/messages');
  }

  async uploadProfilePic(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }
    if (!file.type || !file.type.split('/')[1]) {
      return alert('Thats a really weird file');
    }
    if (file.type.split('/')[0] !== 'image') {
      return alert('Only Images are allowed for profile pics');
    }
    if (!this.uid) {
      return alert('You aint signed in homie');
    }

    await this.userService.updateUserProfilePic(this.uid, file);
  }

  async uploadBackgroundPic(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }
    if (!file.type || !file.type.split('/')[1]) {
      return alert('Thats a really weird file');
    }
    if (file.type.split('/')[0] !== 'image') {
      return alert('Only Images are allowed for background pics');
    }
    if (!this.uid) {
      return alert('You aint signed in homie');
    }

    await this.userService.updateUserBackgroundPic(this.uid, file);
  }
}
