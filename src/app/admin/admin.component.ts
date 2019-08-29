import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  username: string;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const user = await this.authService.user$.pipe(first()).toPromise();

    this.username = user.username;
  }

  logout() {
    this.authService.logout();
  }

}
