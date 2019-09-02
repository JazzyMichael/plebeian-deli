import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

declare var gtag;

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
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
    ) {

      // add custom material icons from svg files
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

      const navEndEvents = router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      );

      navEndEvents.subscribe((event: NavigationEnd) => {
        gtag('config', 'UA-130962516-1', {
          'page_path': event.urlAfterRedirects,
          'loggedIn': this.signedIn ? true : false
        });
      });
  }

  // onSwipeRight(event: any) {
  //   console.log(event);
  // }
}
