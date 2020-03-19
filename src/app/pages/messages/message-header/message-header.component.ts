import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-message-header',
  templateUrl: './message-header.component.html',
  styleUrls: ['./message-header.component.scss']
})
export class MessageHeaderComponent {
  @Input() title: string = '';
  @Input() profilePic: string = '';

  constructor(public location: Location) { }

}
