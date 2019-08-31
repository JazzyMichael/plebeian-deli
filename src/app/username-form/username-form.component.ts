import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { switchMap, debounceTime, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.component.html',
  styleUrls: ['./username-form.component.scss']
})
export class UsernameFormComponent implements OnInit {

  @Output() username: EventEmitter<string> = new EventEmitter();

  signUpForm = this.fb.group({
    username: [
      '',
      Validators.required,
      this.validateUsername.bind(this)
    ]
  });

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit() {
  }

  onInput() {
    if (!this.signUpForm.value.username) {
      this.username.emit(null);
    }
  }

  validateUsername(control: AbstractControl) {
    return control.valueChanges.pipe(
      debounceTime(777),
      switchMap(inputText => {
        const hasWhitespace = /\s/;

        let errors = hasWhitespace.test(inputText) ? { usernameTaken: false, hasWhitespace: true } : null;

        if (errors) {
          this.username.emit(null);
          return of(control.setErrors(errors));
        } else {

          return this.auth.getUser(inputText).pipe(
            switchMap(user => {
              if (user) {
                errors = { usernameTaken: true, hasWhitespace: false };
                this.username.emit(null);
                return of(control.setErrors(errors));
              } else {
                errors = { usernameTaken: false, hasWhitespace: false };
                this.username.emit(this.signUpForm.value.username);
                return of(control.setErrors(errors));
              }
            })
          );
        }
      })
    );
  }

}
