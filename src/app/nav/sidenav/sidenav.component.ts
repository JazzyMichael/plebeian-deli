import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
