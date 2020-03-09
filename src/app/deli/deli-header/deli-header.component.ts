import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, Subscription, Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';

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

  profilePic: Observable<any>;

  notificationsSub: Subscription;
  showDot: boolean;

  @Output() sortChange: EventEmitter<string> = new EventEmitter();
  @Output() searchChange: EventEmitter<string> = new EventEmitter();

  constructor(private auth: AuthService, private notifications: NotificationService) { }

  ngOnInit() {
    this.sort = 'recent';

    this.debouncerSub = this.debouncer$.pipe(
      debounceTime(1234)
    )
    .subscribe(({ term, element }) => {
      element.blur();
      this.searchChange.emit(term);
    });

    this.profilePic = this.auth.user$.asObservable().pipe(
      switchMap(user => user && user.thumbnail ? user.thumbnail : of('assets/images/ham-250.png'))
    );

    this.notificationsSub = this.notifications.newCount$
      .subscribe((count: number = 0) => {
        this.showDot = count > 0;
      });
  }

  ngOnDestroy() {
    this.debouncerSub.unsubscribe();
    this.notificationsSub.unsubscribe();
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

  clearSearch(element: any) {
    if (element && element.value) element.value = '';
    this.debouncer$.next({ term: '', element });
  }

}
