import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  newNotifications$: Observable<any[]>;
  newCount: number;
  loadedOld: boolean;
  defaultIcon: 'favorite';
  iconMap: any = {
    'liked-post': 'favorite',
    'post-comment': 'mode_comment',
    'post-comment-reply': 'forum',
    'event-collaborator': '',
    'order-placed': '',
    'order-accepted': '',
    'order-rejected': '',
    'order-paid': '',
    'order-shipped': '',
    'order-rated': ''
  };
  baseRouteMap: any = {
    'liked-post': '/post',
    'post-comment': '/post',
    'post-comment-reply': '/post',
    'event-collaborator': '/event',
    'order-placed': '/order',
    'order-accepted': '/order',
    'order-rejected': '/order',
    'order-paid': '/order',
    'order-shipped': '/order',
    'order-rated': '/order'
  };

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.newNotifications$ = this.notificationService.notifications$
      .asObservable()
      .pipe(tap(arr => {
        this.newCount = arr && arr.length ? arr.length : 0;
        this.notificationService.newCount$.next(this.newCount);
      }));
  }

  async viewNotification(n: any) {
    // OLD

    const user = await this.authService.getCurrentUser();

    if (!user || !n.notificationId) {
      return;
    }

    const userId = user.uid;
    const notificationId = n.notificationId;
    const obj = { new: false };

    this.notificationService
      .updateNotification(userId, notificationId, obj);
  }

  async vviewNotification({ id, route }) {
    // NEW AND IMPROVED
    const { uid } = await this.authService.getCurrentUser();
    if (!uid) return;
    await this.notificationService.markAsRead(uid, id);
    this.router.navigateByUrl(route)
  }

  async loadOlder() {
    const { uid } = await this.authService.getCurrentUser();
    if (!uid) return;
    this.newNotifications$ = this.notificationService.getOld(uid);
    this.loadedOld = true;
  }

}
