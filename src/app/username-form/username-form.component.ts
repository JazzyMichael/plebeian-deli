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
      this.validateUniqueUsername.bind(this)
    ]
  });

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit() {
  }

  validateUniqueUsername(control: AbstractControl) {
    return control.valueChanges.pipe(
      debounceTime(777),
      switchMap(inputText => this.auth.getUser(inputText)),
      tap(user => user ?
        this.username.emit(null) :
        this.username.emit(this.signUpForm.value.username)),
      switchMap(user => user ?
        of(control.setErrors({ usernameTaken: true })) :
        of(control.setErrors(null))),
    );
  }

}
