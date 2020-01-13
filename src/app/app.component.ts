import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  signedIn: boolean;
  user: any;

  constructor(
    private authService: AuthService,
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


    this.authService.user$.subscribe(user => {
      this.user = user;
      this.signedIn = !!user;
    });
  }
}
