import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of, Subscription } from 'rxjs';

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

  constructor(public location: Location, public auth: AuthService) { }

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      this.user = user;
      this.profilePic = user && user.thumbnail ? user.thumbnail : of('assets/images/ham-250.png');
    });
  }

  ngOnDestroy () {
    if (this.userSub) this.userSub.unsubscribe();
  }

  sidenavClick() {
    this.openSidenav.emit();
  }

}
