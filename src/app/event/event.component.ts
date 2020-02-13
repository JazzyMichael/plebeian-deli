import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  event$: Observable<any>;
  gallery: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      const eventId = params.get('id');

      if (!eventId) {
        return this.router.navigateByUrl('/calendar');
      }

      document.querySelector('.mat-drawer-content').scrollTop = 0;

      document.querySelector('.mat-sidenav-content').scrollTop = 0;

      this.event$ = this.eventService.getEvent(eventId)
        .pipe(
          tap(async event => {
            if (!event) {
              return this.router.navigateByUrl('/calendar');
            }

            if (!this.gallery) {
              this.gallery = await this.userService.getUserById(event.userId || event.gallerId);
            }
          })
        );
    });
  }

  viewGallery() {
    this.router.navigateByUrl(`/${this.gallery.username}`);
  }

}
