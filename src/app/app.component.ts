import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  admin: boolean;
  signedIn: boolean;

  constructor(private router: Router, private authService: AuthService) {
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

    this.authService.user$.subscribe(user => this.signedIn = !!user);
  }

  onSwipeRight(event: any) {
    console.log(event);
  }
}
