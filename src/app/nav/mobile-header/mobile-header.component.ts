import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit {

  @Output() openSidenav: EventEmitter<any> = new EventEmitter();

  constructor(public location: Location, public auth: AuthService) { }

  ngOnInit() {
  }

  sidenavClick() {
    this.openSidenav.emit();
  }

}
