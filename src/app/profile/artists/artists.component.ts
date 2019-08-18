import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  @Input() user: any;
  @Input() editable: boolean;

  constructor() { }

  ngOnInit() {
    // console.log(this.user);
  }

}
