import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user$: Observable<any>;

  debounce: any;

  constructor(
    private auth: AuthService,
    private snackbar: MatSnackBar,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user$ = this.auth.user$.asObservable();
  }

  updateField(uid: string, field: string, value: string) {
    if (this.debounce) {
      clearTimeout(this.debounce);
    }

    this.debounce = setTimeout(async () => {
      const obj = {};
      obj[field] = value;
      await this.userService.updateUserPromise(uid, obj);
      this.snackbar.open('Profile Updated!', 'Ok', { duration: 3000 });
    }, 666);
  }

}
