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
    private router: Router,
    private analyticsService: AnalyticsService
    ) {
      const cachedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      this.user$ = new BehaviorSubject(cachedUser);
      this.username = '';

      this.afAuth.auth.getRedirectResult()
        .then(res => {
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
            return this.afStore.doc(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      ).subscribe((user: any) => {
        if (user) {
          this.chatService.getUserChats(user.uid);
          this.username = user.username;
          this.user$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
          this.username = null;
          this.user$.next(null);
        }
      });
    }

  async loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();

    await this.afAuth.auth.signInWithRedirect(provider);
  }

  async loginWithFacebook() {
    const provider = new auth.FacebookAuthProvider();

    provider.addScope('email');

    await this.afAuth.auth.signInWithRedirect(provider);
  }

  async handleAuthData(authData: any) {

    if (authData && authData.additionalUserInfo && authData.additionalUserInfo.isNewUser) {

      const providerId = authData.additionalUserInfo.providerId;

      const random = Math.random().toString().slice(2, 8);

      const username = authData.user.displayName.substring(0, 4) + `${random}`;

      const email = authData.user.email;

      const isOldUser = this.oldUserService.oldUserEmails.some(e => e === email);

      const membership = isOldUser ? 'artist' : 'viewer';

      await this.createUserDoc({ ...authData.user, username, membership, providerId });

      this.analyticsService.login();

      if (!isOldUser) {
        return this.router.navigateByUrl('/checkout');
      } else {
        setTimeout(() => {
          const route = username ? `/${username}` : '/deli';
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

  createUserDoc({ uid, username, displayName, email, phoneNumber, photoURL, membership, providerId }) {
    const userDoc = this.afStore.doc(`users/${uid}`);

    const data = {
      uid,
      username,
      displayName,
      email,
      phoneNumber,
      membership,
      providerId,
      profileUrl: photoURL,
      backgroundUrl: null,
      description: null,
      cv: null,
      followers: 0,
      instagramUrl: null,
      twitterUrl: null,
      facebookUrl: null,
      medium: null,
      createdTimestamp: new Date(),
      createdDate: Date.now()
    };

    return userDoc.set(data, { merge: true });
  }

  getCurrentUser() {
    return this.user$.pipe(first()).toPromise();
  }

  getUser(username: string): Observable<any> {
    return this.afStore
      .collection('users', ref => ref.where('username', '==', username))
      .valueChanges()
      .pipe(
        tap(res => console.log('firebase res', res)),
        map(arr => arr[0] ? arr[0] : null)
      );
  }
}
