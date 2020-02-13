import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  userSub: Subscription;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      if (user) {
        this.auth.navigateToProfile();
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  googleLogin() {
    this.auth.loginWithGoogle();
  }

  facebookLogin() {
    this.auth.loginWithFacebook();
  }

}
