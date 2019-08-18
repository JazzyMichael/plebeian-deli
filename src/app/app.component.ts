import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  admin: boolean;

  constructor(private router: Router) {
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
  }

  onSwipeRight(event: any) {
    console.log(event);
  }
}
