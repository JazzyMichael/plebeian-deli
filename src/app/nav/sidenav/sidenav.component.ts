import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() user: any;

  @Output() closeSidenav: EventEmitter<any> = new EventEmitter();
  @Output() gotoUserProfile: EventEmitter<any> = new EventEmitter();

  @Output() signIn: EventEmitter<any> = new EventEmitter();
  @Output() signOut: EventEmitter<any> = new EventEmitter();

  newCount: number;

  constructor(public notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.newCount$.subscribe(num => this.newCount = num || 0);
  }

  installClick() {
    this.notificationService.deferredPrompt.prompt();

    this.notificationService.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Accepted :)');
          this.notificationService.deferredPrompt = null;
          this.notificationService.canInstall = false;
        } else {
          console.log('Dismissed :(');
        }
      })
      .catch((error) => {
        console.log('error with install prompt', error);
        this.notificationService.deferredPrompt = null;
        this.notificationService.canInstall = false;
      });
  }

}
