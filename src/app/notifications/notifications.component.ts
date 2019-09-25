import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  newNotifications$: Observable<any[]>;
  newCount: number;

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.newNotifications$ = this.notificationService.notifications$
      .asObservable()
      .pipe(tap(arr => {
        this.newCount = arr && arr.length ? arr.length : 0;
        this.notificationService.newCount$.next(this.newCount);
      }));
  }

  viewNotification(n: any) {
    console.log(n);
  }

}
