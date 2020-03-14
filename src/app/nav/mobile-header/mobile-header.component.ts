import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit, OnDestroy {

  @Output() openSidenav: EventEmitter<any> = new EventEmitter();

  userSub: Subscription;
  user: any;
  profilePic: Observable<any>;
  showDot: boolean;
  notificationSub: Subscription;

  constructor(
    public location: Location,
    public auth: AuthService,
    public notifications: NotificationService
  ) { }

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      this.user = user;
      this.profilePic = user && user.thumbnail ? user.thumbnail : of('assets/icons/icon-192x192.png');
    });

    this.notificationSub = this.notifications.newCount$
      .subscribe((count: number = 0) => {
        this.showDot = count > 0;
      });
  }

  ngOnDestroy () {
    this.userSub.unsubscribe();
    this.notificationSub.unsubscribe();
  }

  sidenavClick() {
    if (!this.user) this.auth.navigateToProfile();
    else this.openSidenav.emit();
  }

}
