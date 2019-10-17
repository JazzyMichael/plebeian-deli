import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import * as firebase from 'firebase';

// declare var gtag;
declare var fbq;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private router: Router) { }

  startPageTracking() {
    // const navEndEvents = this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // );

    // navEndEvents.subscribe((event: NavigationEnd) => {
    //   gtag('config', 'UA-130962516-1', {
    //     'page_path': event.urlAfterRedirects
    //   });
    // });

    if (firebase) {
      console.log('yes firebase');
      // console.log(firebase);
    } else {
      console.log('no firebase');
    }

    try {
      firebase.analytics();
      console.log('analytics success');
    } catch (e) {
      console.log('.analytics() err', e);
    }
  }

  viewSignUpPopup() {
    try {
      firebase.analytics().logEvent('view_signup-popup', { testProp: 'ayo testo' });
      console.log('event success');
    } catch (e) {
      console.log('event err', e);
    }
  }

  closeSignUpPopup() {
    try {
      firebase.analytics().logEvent('close_signup_popup', { testProp: 'yomayo tomato' });
      console.log('event success');
    } catch (e) {
      console.log('event err', e);
    }
  }

  loginFromPopupClick() {
    try {
      firebase.analytics().logEvent('popup_login_click', { testProp: 'pleb alato' });
      console.log('event success');
    } catch (e) {
      console.log('event err', e);
    }
  }

  addToCart() {
    try {
      fbq('track', 'AddToCart');
      console.log('AddToCart');
    } catch (e) {
      console.log('Pixel AddToCart error', e);
    }
  }

  login() {
    try {
      fbq('track', 'CompleteRegistration');
    } catch (e) {
      console.log('Pixel Registration Error');
    }
  }



}
