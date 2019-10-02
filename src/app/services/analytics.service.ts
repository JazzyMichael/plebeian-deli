import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import * as firebase from 'firebase';

declare var gtag;
declare var fbq;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private router: Router) { }

  startPageTracking() {
    const navEndEvents = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-130962516-1', {
        'page_path': event.urlAfterRedirects
      });
    });

    if (firebase) {
      console.log('yes firebase');
      console.log(firebase);
    } else {
      console.log('no firebase');
    }
  }

  viewSignUpPopup() {
    //
  }

  closeSignUpPopup() {
    //
  }

  loginFromSignUpPopup() {
    //
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
