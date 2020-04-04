import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  event$: Observable<any>;
  eventId: string;
  gallery: any;

  likeCount: number;
  alreadyLiked: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {

      this.eventId = params.get('id');

      if (!this.eventId) return this.router.navigateByUrl('/calendar');

      document.querySelector('.mat-drawer-content').scrollTop = 0;
      document.querySelector('.mat-sidenav-content').scrollTop = 0;

      this.event$ = this.eventService.getEvent(this.eventId)
        .pipe(
          tap(async event => {
            this.likeCount = 0;
            this.alreadyLiked = false;
            if (!event) return this.router.navigateByUrl('/calendar');
            this.gallery = await this.userService.getUserById(event.userId);
          })
        );
    });
  }

  like() {
    this.alreadyLiked = !this.alreadyLiked;
    this.likeCount = this.alreadyLiked ? 1 : 0;
  }

  viewGallery() {
    this.router.navigateByUrl(`/${this.gallery.username}`);
  }

}
