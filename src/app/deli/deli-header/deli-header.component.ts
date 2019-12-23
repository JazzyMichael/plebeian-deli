import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-deli-header',
  templateUrl: './deli-header.component.html',
  styleUrls: ['./deli-header.component.scss']
})
export class DeliHeaderComponent implements OnInit {
  sort: string;
  searching: boolean;

  @Output() sortChange: EventEmitter<string> = new EventEmitter();

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.sort = 'recent';
  }

  profileClick() {
    this.auth.navigateToProfile();
  }

  changeSort(sortString: string) {
    if (this.sort === sortString) {
      return;
    }
    this.sort = sortString;
    this.sortChange.emit(this.sort);
  }

}
