import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { switchMap, debounceTime, tap } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signUpForm = this.fb.group({
    username: [
      '',
      Validators.required,
      this.validateUniqueUsername.bind(this)
    ]
  });

  constructor(
    private fb: FormBuilder,
    public auth: AuthService) { }

  ngOnInit() {
  }

  validateUniqueUsername(control: AbstractControl) {
    return control.valueChanges.pipe(
      debounceTime(777),
      tap(val => console.log('val', val)),
      switchMap(val => this.auth.getUser(val)),
      switchMap(userArr => userArr ? of(control.setErrors({ usernameTaken: true })) : of(control.setErrors(null))),
    );
  }

  signInWithGoogle() {
    console.log('username');
  }

}
