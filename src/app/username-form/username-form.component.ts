import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { switchMap, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.component.html',
  styleUrls: ['./username-form.component.scss']
})
export class UsernameFormComponent {

  @Output() username: EventEmitter<string> = new EventEmitter();

  usernameForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\S*$/)
      ],
      this.validateUsername.bind(this)
    ]
  });

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  onInput() {
    if (!this.usernameForm.valid) {
      this.username.emit('');
    }
  }

  validateUsername(control: AbstractControl) {
    return control.valueChanges.pipe(
      debounceTime(777),
      switchMap(inputText => this.auth.getUser(inputText)),
      switchMap((user: any) => of(!!user)),
      switchMap((usernameTaken: boolean) => {
        if (usernameTaken) {
          this.username.emit('');
          return of(control.setErrors({ usernameTaken }));
        }
        this.username.emit(this.usernameForm.value.username);
        control.setErrors({});
        control.updateValueAndValidity(this.usernameForm.value.username);
        return of();
      })
    );
  }

}
