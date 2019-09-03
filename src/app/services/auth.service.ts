import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { switchMap, first, map, tap } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { OldUserService } from './old-user.service';

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
    private router: Router
    ) {
      this.user$ = new BehaviorSubject(null);
      this.username = '';

      this.afAuth.auth.getRedirectResult()
        .then(res => {
          console.log('redirect res', res);
          if (res && res.user) {
            this.handleAuthData(res);
          }
        })
        .catch(e => {
          console.log('redirect err', e);
        });

      this.afAuth.authState.pipe(
        switchMap((user: any) => {
          console.log('auth user', user);
          if (user && user.uid) {
            return this.afStore.doc(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      ).subscribe((user: any) => {
        console.log('auth service user', user);
        if (user) {
          this.chatService.getUserChats(user.uid);
          this.username = user.username;
          localStorage.setItem('username', user.username);
          this.user$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          this.username = null;
          this.user$.next(null);
        }
      });
    }

  async loginWithGoogle() {
    const provider = new auth.GoogleAuthProvider();

    const authData = await this.afAuth.auth.signInWithRedirect(provider);

    // const realAuthData = await this.afAuth.auth.getRedirectResult();

    // console.log('google authData', realAuthData);

    // this.handleAuthData(realAuthData);
  }

  async loginWithFacebook() {
    const provider = new auth.FacebookAuthProvider();

    provider.addScope('email');

    const authData = await this.afAuth.auth.signInWithRedirect(provider);

    // const realAuthData = await this.afAuth.auth.getRedirectResult();

    // console.log('facebook authData', realAuthData);

    // this.handleAuthData(realAuthData);
  }

  async handleAuthData(authData: any) {
    console.log('handleAuthData', authData);

    if (authData && authData.additionalUserInfo && authData.additionalUserInfo.isNewUser) {

      const providerId = authData.additionalUserInfo.providerId;

      const random = Math.random().toString().slice(2, 8);

      const username = authData.user.displayName.substring(0, 4) + `${random}`;

      const email = authData.user.email;

      const isOldUser = this.oldUserService.oldUserEmails.some(e => e === email);

      const membership = isOldUser ? 'artist' : 'viewer';

      await this.createUserDoc({ ...authData.user, username, membership, providerId });

      if (!isOldUser) {
        return this.router.navigateByUrl('/checkout');
      } else {
        setTimeout(() => {
          return this.router.navigateByUrl(`/deli`);
        }, 500);
      }

    } else {
      setTimeout(() => {
        return this.router.navigateByUrl(`/deli`);
      }, 500);
    }
  }

  async logout() {
    console.log('logout');
    const res = await this.afAuth.auth.signOut();
    console.log('signout res', res);
    // this.chatService.userChats$.next([]);
    return this.router.navigateByUrl('/prime-cuts');
  }

  createUserDoc({ uid, username, displayName, email, phoneNumber, photoURL, membership, providerId }) {
    console.log('createUserDoc');
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
    console.log('getCurrentUser');
    return this.user$.pipe(first()).toPromise();
  }

  getUser(username: string): Observable<any> {
    console.log('getUser', username);
    return this.afStore
      .collection('users', ref => ref.where('username', '==', username))
      .valueChanges()
      .pipe(
        tap(res => console.log('firebase res', res)),
        map(arr => arr[0] ? arr[0] : null)
      );
  }
}
