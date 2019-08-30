import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';
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

      this.afAuth.authState.pipe(
        switchMap((user: any) => user
        ? this.afStore.doc<any>(`users/${user.uid}`).valueChanges()
        : of(null))
      ).subscribe(user => {
        if (user) {
          this.chatService.getUserChats(user.uid);
          this.username = user.username;
          localStorage.setItem('username', user.username);
          this.user$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          this.username = null;
          localStorage.removeItem('username');
          this.user$.next(null);
          localStorage.removeItem('user');
        }
      });
    }

  async anonymousLogin() {
    await this.afAuth.auth.signInAnonymously();
    return this.router.navigateByUrl('/');
  }

  async loginWithGoogle() {
    const authData = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

    if (authData && authData.additionalUserInfo && authData.additionalUserInfo.isNewUser) {
      console.log('new user');

      const username = authData.user.displayName.substring(0, 4) + `${Date.now()}`.substring(0, 4);

      const email = authData.user.email;

      const isOldUser = this.oldUserService.oldUserEmails.some(e => e === email);

      const membership = isOldUser ? 'artist' : 'viewer';

      await this.createUserDoc({ ...authData.user, username, membership });

      if (!isOldUser) {
        console.log('not old user, navigate to checkout');
        return this.router.navigateByUrl('/checkout');
      } else {
        console.log('old user');
        setTimeout(() => {
          return this.router.navigateByUrl(`/${this.username}`);
        }, 500);
      }

    } else {
      setTimeout(() => {
        return this.router.navigateByUrl(`/${this.username}`);
      }, 500);
    }
  }

  async logout() {
    await this.afAuth.auth.signOut();
    this.chatService.userChats$.next([]);
    return this.router.navigateByUrl('/prime-cuts');
  }

  createUserDoc({ uid, username, displayName, email, phoneNumber, photoURL, membership }) {
    const userDoc = this.afStore.doc(`users/${uid}`);

    const data = {
      uid,
      username,
      displayName,
      email,
      phoneNumber,
      membership,
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

    return userDoc.set(data);
  }

  getCurrentUser() {
    return this.user$.pipe(first()).toPromise();
  }

  getUser(username: string): Observable<any> {
    return this.afStore
      .collection('users', ref => ref.where('username', '==', username))
      .valueChanges()
      .pipe(
        map(arr => arr[0] ? arr[0] : null)
      );
  }
}
