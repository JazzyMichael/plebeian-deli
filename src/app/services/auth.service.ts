import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, first, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ChatService } from './chat.service';

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
    private router: Router) {
      const cachedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const cachedUsername = localStorage.getItem('username') ? localStorage.getItem('username') : null;

      this.user$ = new BehaviorSubject(cachedUser);
      this.username = cachedUsername;

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

  async signUpWithGoogle(username?: string) {
    if (!username) {
      return;
    }

    const authData = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

    if (authData && authData.additionalUserInfo && authData.additionalUserInfo.isNewUser) {
      await this.createUserDoc({...authData.user, username });
      return this.router.navigateByUrl('/');
    } else {
      window.alert('You already have an account!');
      return this.router.navigateByUrl(`/about`);
    }
  }

  async loginWithGoogle() {
    const authData = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

    if (authData && authData.additionalUserInfo && authData.additionalUserInfo.isNewUser) {
      window.alert('A username has been automatically generated for your free account');
      const username = authData.user.displayName.substring(0, 4) + `${Date.now()}`.substring(0, 5);
      await this.createUserDoc({ ...authData.user, username });
      return this.router.navigateByUrl(`/${username}`);
    }

    setTimeout(() => {
      return this.router.navigateByUrl(`/${this.username}`);
    }, 500);
  }

  async logout() {
    await this.afAuth.auth.signOut();
    return this.router.navigateByUrl('/about');
  }

  createUserDoc({ uid, username, displayName, email, phoneNumber, photoURL }) {
    const userDoc = this.afStore.doc(`users/${uid}`);

    const data = {
      uid,
      username,
      displayName,
      email,
      phoneNumber,
      membership: 'artist',
      profileUrl: photoURL,
      backgroundUrl: null,
      description: null,
      cv: null,
      followers: 0,
      instagramUrl: null,
      twitterUrl: null,
      facebookUrl: null,
      medium: null,
      createdTimestamp: Date.now(),
      createdDate: new Date()
    };

    return userDoc.set(data);
  }

  getCurrentUser() {
    return this.user$.pipe(first()).toPromise();
  }

  getUser(username: string) {
    return this.afStore
      .collection('users', ref => ref.where('username', '==', username))
      .valueChanges()
      .pipe(
        map(arr => arr[0] ? arr[0] : null)
      );
  }
}
