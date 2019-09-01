import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  username: string;
  uSub: Subscription;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.uSub = this.authService.user$.subscribe(user => {
      if (user) {
        this.username = user.username;
      } else {
        this.username = '';
      }
    });

    // console.log('admin user', user);

    // this.username = user ? user.username : 'potato';
  }

  ngOnDestroy() {
    try {
      this.uSub.unsubscribe();
    } catch (e) { }
  }

  logout() {
    this.authService.logout();
  }

}
