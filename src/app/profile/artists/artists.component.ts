import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  @Input() user: any;
  @Input() editable: boolean;

  editing: boolean;
  artists: any[];

  constructor() { }

  ngOnInit() {
    this.artists = [
      { username: 'jim', profileUrl: '' },
      { username: 'pete', profileUrl: '' },
      { username: 'anne', profileUrl: '' },
      { username: 'harold', profileUrl: '' },
      { username: 'deborah', profileUrl: '' },
      { username: 'steve', profileUrl: '' }
    ];
  }

  removeArtist(index: number) {
    this.artists.splice(index, 1);
  }

}
