import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject, of } from 'rxjs';
import { EventService } from '../services/event.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AnimationTriggerMetadata, transition, style, animate, trigger } from '@angular/animations';

const colors: any = {
  red: { primary: '#ad2121', secondary: '#FAE3E3' },
  blue: { primary: '#1e90ff', secondary: '#D1E8FF' },
  yellow: { primary: '#e3bc08', secondary: '#FDF1BA' }
};

export const collapseAnimation: AnimationTriggerMetadata = trigger('collapse', [
  transition('void => *', [
    style({ height: 0, overflow: 'hidden' }),
    animate('150ms', style({ height: '*' }))
  ]),
  transition('* => void', [
    style({ height: '*', overflow: 'hidden' }),
    animate('150ms', style({ height: 0 }))
  ])
]);

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [collapseAnimation]
})
export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

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
            data: event
          };
        }));
      })
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('dayClicked');
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
