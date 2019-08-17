import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  darkTheme: boolean = true;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  changeTheme() {
    this.darkTheme = !this.darkTheme;
  }

}
