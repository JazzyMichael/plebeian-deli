import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit {

  @Output() openSidenav: EventEmitter<any> = new EventEmitter();

  profilePic: Observable<any>;

  constructor(public location: Location, public auth: AuthService) {
    this.profilePic = this.auth.user$.asObservable().pipe(
      switchMap(user => user && user.thumbnail ? user.thumbnail : of('assets/images/ham-250.png'))
    );
  }

  ngOnInit() {
  }

  sidenavClick() {
    this.openSidenav.emit();
  }

}
