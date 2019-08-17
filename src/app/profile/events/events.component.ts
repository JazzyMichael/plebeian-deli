import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  @Input() user: any;
  @Input() editable: boolean;

  eventForm: FormGroup;
  editing: boolean;
  pickerFilter: any;

  constructor(public eventService: EventService) {
    this.pickerFilter = (d: Date): boolean => {
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return d > today;
    };
  }

  ngOnInit() {
    console.log(this.user.uid);
    this.createEventForm();
  }

  createEventForm() {
    this.eventForm = new FormGroup({
      title: new FormControl(),
      location: new FormControl(),
      date: new FormControl(),
      time: new FormControl(),
      description: new FormControl(),
      picture: new FormControl(),
      link: new FormControl()
    });
  }

  submitEvent() {
    const formattedDate = new Date(this.eventForm.value.date.seconds * 1000);
    const event = { ...this.eventForm.value, formattedDate };
    console.log('new event', event);
    this.eventService.addEvent(this.user.uid, event);
    this.editing = false;
    this.eventForm.reset();
  }

}
