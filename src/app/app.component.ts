import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './services/analytics.service';

declare var gtag;
// declare var fbq;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  admin: boolean;
  signedIn: boolean;
  user: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ) {

      // add custom material icons from svg files
      this.matIconRegistry.addSvgIcon('custommenu',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/menu-icon.svg'));

      this.matIconRegistry.addSvgIcon('facebook',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/social/facebook.svg'));
      this.matIconRegistry.addSvgIcon('instagram',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/social/instagram.svg'));
      this.matIconRegistry.addSvgIcon('twitter',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/social/twitter.svg'));
      this.matIconRegistry.addSvgIcon('youtube',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/social/youtube.svg'));


      this.router.events.subscribe(x => {
        this.admin = this.router.url === '/admin'
          || this.router.url === '/admin/new-post'
          || this.router.url === '/admin/featured'
          || this.router.url === '/admin/exhibitions'
          || this.router.url === '/admin/studios'
          || this.router.url === '/admin/promo-codes'
          || this.router.url === '/admin/store'
          || this.router.url === '/admin/more'
          || this.router.url === 'admin';
      });

      this.authService.user$.subscribe(user => {
        this.user = user;
        this.signedIn = !!user;
      });

      this.analyticsService.startPageTracking();
  }

  // onSwipeRight(event: any) {
  //   console.log(event);
  // }
}
