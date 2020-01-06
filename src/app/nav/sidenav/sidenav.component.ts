import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  newCount: number;

  @Input() user: any;

  @Output() closeSidenav: EventEmitter<any> = new EventEmitter();
  @Output() gotoUserProfile: EventEmitter<any> = new EventEmitter();

  @Output() signIn: EventEmitter<any> = new EventEmitter();
  @Output() signOut: EventEmitter<any> = new EventEmitter();

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.newCount$.subscribe(num => this.newCount = num || 0);
  }

}
