import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  darkTheme: boolean = true;
  newCount: number;

  constructor(
    public auth: AuthService,
    private themeService: ThemeService,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.notificationService.newCount$.subscribe(num => this.newCount = num || 0);
  }

  changeTheme() {
    this.darkTheme = !this.darkTheme;
    this.themeService.isDarkTheme.next(this.darkTheme);
  }

}
