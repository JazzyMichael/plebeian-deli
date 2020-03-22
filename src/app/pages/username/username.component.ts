import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {
  username: string;

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  handleUsername(username: string = '') {
    this.username = username;
  }

  async saveUsername(username: string = '') {
    const { uid } = await this.auth.getCurrentUser();
    await this.userService.updateUserPromise(uid, { username });
    this.snackbar.open('Username Changed!', '', { duration: 3000 });
    this.router.navigateByUrl('/edit-profile');
  }

}
