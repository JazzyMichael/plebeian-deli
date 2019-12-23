import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-widescreen-header',
  templateUrl: './widescreen-header.component.html',
  styleUrls: ['./widescreen-header.component.scss']
})
export class WidescreenHeaderComponent implements OnInit {
  newCount: number;

  constructor(public auth: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.newCount$.subscribe(num => this.newCount = num || 0);
  }

}
