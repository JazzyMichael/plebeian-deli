import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  startOfDay,
  isSameDay,
  isSameMonth
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView
} from 'angular-calendar';
import { Subject, of } from 'rxjs';
import { EventService } from '../services/event.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

const colors: any = {
  red: { primary: '#ad2121', secondary: '#FAE3E3' },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF' },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA' }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      }
    }
  ];

  events$: any;

  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit() {
    this.events$ = this.eventService.events$.pipe(
      switchMap((events: any[]) => {
        return of(events.map(event => {
          return {
            start: startOfDay(new Date(event.date.seconds * 1000)),
            title: event.title,
            color: colors.red,
            actions: this.actions,
            data: event
          };
        }));
      })
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent | any): void {
    const eventId = event.data.eventId;
    this.router.navigateByUrl(`/event/${eventId}`);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
