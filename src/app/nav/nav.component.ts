import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { trigger, AnimationTriggerMetadata, transition, style, animate, query } from '@angular/animations';

export const routeTransitionAnimation: AnimationTriggerMetadata = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        left: 0,
        width: '100%',
        opacity: 0,
        transform: 'scale(0) translateY(100%)'
      })
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease', style({
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      }))
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [routeTransitionAnimation]
})
export class NavComponent implements OnInit, OnDestroy {
  newCount: number;

  toggleSidenavSub: Subscription;

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(
    public auth: AuthService,
    public location: Location,
    private notificationService: NotificationService
    ) { }

  ngOnInit() {
    this.notificationService.newCount$.subscribe(num => this.newCount = num || 0);

    this.toggleSidenavSub = this.auth.toggleSidenav.subscribe(bool => {
      this.sidenav.open();
    });
  }

  ngOnDestroy() {
    if (this.toggleSidenavSub) {
      this.toggleSidenavSub.unsubscribe();
    }
  }
}
