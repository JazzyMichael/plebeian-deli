import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  newCount: number;

  constructor(
    public auth: AuthService,
    public location: Location,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.notificationService.newCount$.subscribe(num => this.newCount = num || 0);
  }
}
