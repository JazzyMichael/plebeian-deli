import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { switchMap, debounceTime, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

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

  validateUniqueUsername(control: AbstractControl) {
    return control.valueChanges.pipe(
      debounceTime(777),
      tap(val => console.log('val', val)),
      switchMap(val => this.auth.getUser(val)),
      switchMap(userArr => userArr ? of(control.setErrors({ usernameTaken: true })) : of(control.setErrors(null))),
    );
  }

  googleLogin() {
    this.auth.loginWithGoogle();
  }

  facebookLogin() {
    this.auth.loginWithFacebook();
  }

}
