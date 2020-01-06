import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-deli-header',
  templateUrl: './deli-header.component.html',
  styleUrls: ['./deli-header.component.scss']
})
export class DeliHeaderComponent implements OnInit, OnDestroy {
  sort: string;
  searching: boolean;

  debouncer$: Subject<any> = new Subject();
  debouncerSub: Subscription;

  @Output() sortChange: EventEmitter<string> = new EventEmitter();

  @Output() searchChange: EventEmitter<string> = new EventEmitter();

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.sort = 'recent';

    this.debouncerSub = this.debouncer$.pipe(
      debounceTime(2000)
    )
    .subscribe(({ term, element }) => {
      element.blur();
      this.searchChange.emit(term);
    });
  }

  ngOnDestroy() {
    this.debouncerSub.unsubscribe();
  }

  openSidenav() {
    this.auth.toggleSidenav.next(true);
  }

  changeSort(sortString: string) {
    if (this.sort === sortString) {
      return;
    }
    this.sort = sortString;
    this.sortChange.emit(this.sort);
  }

  search(term: string, element: any) {
    this.debouncer$.next({ term, element });
  }

}
