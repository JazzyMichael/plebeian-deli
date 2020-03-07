import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Observable, Subject } from 'rxjs';
import { switchMap, first, map, startWith } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<any>;
  username: string;

  toggleSidenav: Subject<boolean> = new Subject();

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router,
    private chatService: ChatService,
    private userService: UserService,
    private notificiationService: NotificationService
  ) {
      // const startingUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const startingUser = null;
      if (startingUser) {
        startingUser['thumbnail'] = this.userService.getUserThumbnail(startingUser, 250);
        startingUser['backgroundThumbnail'] = this.userService.getUserBackground(startingUser, 500);
      }
      this.user$ = new BehaviorSubject(startingUser);
      this.username = '';

      this.afAuth.auth.getRedirectResult()
        .then(res => { if (res && res.user) { this.handleAuthData(res); } })
        .catch(e => console.log('auth redirect error', e));

      this.afAuth.authState.pipe(
        switchMap((user: any) => {
          if (user && user.uid) {
            this.notificiationService.getNew(user.uid);
            this.chatService.getUserChats(user.uid);
            return this.afStore.doc(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      ).subscribe((user: any) => {
        if (user) {
          user['thumbnail'] = this.userService.getUserThumbnail(user, 250);
          user['backgroundThumbnail'] = this.userService.getUserBackground(user, 500);
          this.username = user.username;
          this.user$.next(user);
          // localStorage.setItem('user', JSON.stringify(user));
        } else {
          // localStorage.removeItem('user');
          this.username = null;
          this.user$.next(null);
          this.notificiationService.reset();
        }
      });
    }

  async loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();

    try {
      await this.afAuth.auth.signInWithPopup(provider);
    } catch (e) {
      if (e && e.code !== 'auth/popup-closed-by-user') {
        console.log('error signing in with popup, trying redirect', e);
        await this.afAuth.auth.signInWithRedirect(provider);
      }
    }
  }

  async loginWithFacebook() {
    const provider = new auth.FacebookAuthProvider();

    provider.addScope('email');

    try {
      await this.afAuth.auth.signInWithPopup(provider);
    } catch (e) {
      if (e && e.code !== 'auth/popup-closed-by-user') {
        console.log('error signing in with popup, trying redirect', e);
        await this.afAuth.auth.signInWithRedirect(provider);
      }
    }
  }

  async handleAuthData(authData: any) {
    if (authData && authData.additionalUserInfo && authData.additionalUserInfo.isNewUser) {
      setTimeout(() => { this.router.navigateByUrl('/edit-profile'); }, 250);
    } else {
      setTimeout(() => { this.router.navigateByUrl(this.username ? `/${this.username}` : '/deli'); }, 250);
    }
  }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.clear();
    return this.router.navigateByUrl('/login');
  }

  getCurrentUser() {
    return this.user$.pipe(first()).toPromise();
  }

  navigateToProfile() {
    const url = this.username ? `/${this.username}` : '/login';
    this.router.navigateByUrl(url);
  }

  getUser(username: string): Observable<any> {
    return this.afStore
      .collection('users', ref => ref.where('username', '==', username))
      .valueChanges()
      .pipe(
        map(arr => arr[0] ? arr[0] : null),
        map((user: any) => {
          if (!user) {
            return null;
          }

          return {
            ...user,
            smallThumbnail: this.userService.getUserThumbnail(user, 100),
            mediumThumbnail: this.userService.getUserThumbnail(user, 250),
            backgroundThumbnail: this.userService.getUserBackground(user, 500)
          };
        })
      );
  }
}
