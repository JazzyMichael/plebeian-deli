import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { switchMap, first, map, tap } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { OldUserService } from './old-user.service';
import { AnalyticsService } from './analytics.service';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<any>;
  username: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private chatService: ChatService,
    private oldUserService: OldUserService,
    private userService: UserService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private notificiationService: NotificationService
    ) {
      this.user$ = new BehaviorSubject(null);
      this.username = '';

      this.afAuth.auth.getRedirectResult()
        .then(res => {
          console.log('redirect res', res)
          if (res && res.user) {
            this.handleAuthData(res);
          }
        })
        .catch(e => {
          console.log('redirect err', e);
        });

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
          user['thumbnail'] = this.userService.getUserThumbnail(user);
          this.username = user.username;
          this.user$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
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
      this.analyticsService.login();
    } catch (e) {
      console.log('error signing in with popup, trying redirect', e);
      await this.afAuth.auth.signInWithRedirect(provider);
    }
  }

  async loginWithFacebook() {
    const provider = new auth.FacebookAuthProvider();

    provider.addScope('email');

    try {
      await this.afAuth.auth.signInWithPopup(provider);
      this.analyticsService.login();
    } catch (e) {
      console.log('error signing in with popup, trying redirect', e);
      await this.afAuth.auth.signInWithRedirect(provider);
    }
  }

  async handleAuthData(authData: any) {

    if (authData && authData.additionalUserInfo && authData.additionalUserInfo.isNewUser) {

      const email = authData.user.email;

      const isOldUser = this.oldUserService.oldUserEmails.some(e => e === email);

      this.analyticsService.login();

      if (!isOldUser) {
        return this.router.navigateByUrl('/checkout');
      } else {
        setTimeout(() => {
          const route = '/deli';
          return this.router.navigateByUrl(route);
        }, 100);
      }

    } else {
      setTimeout(() => {
        const route = this.username ? `/${this.username}` : '/deli';
        return this.router.navigateByUrl(route);
      }, 100);
    }
  }

  async logout() {
    const res = await this.afAuth.auth.signOut();
    // this.chatService.userChats$.next([]);
    return this.router.navigateByUrl('/prime-cuts');
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
