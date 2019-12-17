import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deli-header',
  templateUrl: './deli-header.component.html',
  styleUrls: ['./deli-header.component.scss']
})
export class DeliHeaderComponent implements OnInit {
  sort: string;

  constructor() { }

  ngOnInit() {
    this.sort = 'recent';
  }

  changeSort(sortString: string) {
    this.sort = sortString;
  }

}
