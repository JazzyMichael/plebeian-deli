import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-deli-header',
  templateUrl: './deli-header.component.html',
  styleUrls: ['./deli-header.component.scss']
})
export class DeliHeaderComponent implements OnInit {
  sort: string;
  searching: boolean;

  @Output() sortChange: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.sort = 'recent';
  }

  changeSort(sortString: string) {
    if (this.sort === sortString) {
      return;
    }
    this.sort = sortString;
    this.sortChange.emit(this.sort);
  }

}
