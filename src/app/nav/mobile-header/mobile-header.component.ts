import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit {

  @Output() openSidenav: EventEmitter<any> = new EventEmitter();

  constructor(public location: Location) { }

  ngOnInit() {
  }

  sidenavClick() {
    this.openSidenav.emit();
  }

}
