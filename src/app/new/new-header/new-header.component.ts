import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-header',
  templateUrl: './new-header.component.html',
  styleUrls: ['./new-header.component.scss']
})
export class NewHeaderComponent {
  constructor(public location: Location) { }
}
