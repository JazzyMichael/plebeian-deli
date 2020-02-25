import { Component, HostListener } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(swUpdates: SwUpdate, private ns: NotificationService) {

    swUpdates.available.subscribe(event => {
      console.log(`Current Version: ${event.current} | Available Version: ${event.available}`);
      swUpdates.activateUpdate()
        .then(() => document.location.reload())
        .catch(e => console.log('Error updating app', e));
    });

    swUpdates.activated.subscribe(event => {
      console.log(`Upgraded ${event.previous} to ${event.current}`);
    });

  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    e.preventDefault();
    this.ns.deferredPrompt = e;
    this.ns.canInstall = true;
  }
}
