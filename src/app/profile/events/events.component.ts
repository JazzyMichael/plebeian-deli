import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { AngularFireStorage } from '@angular/fire/storage';

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

  random: string;

  constructor(public eventService: EventService, private storage: AngularFireStorage) {
    this.pickerFilter = (d: Date): boolean => {
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return d > today;
    };
  }

  ngOnInit() {
    console.log(this.user.uid);
    this.createEventForm();
    this.random = Math.random().toString().slice(2, 10);
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

  async uploadEventPic(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('Only Images are allowed for event picture');
      return;
    }

    const eventTitle = this.eventForm.value.title.split(' ').join('-');

    const path = `event-pictures/${eventTitle}-${this.random}`;

    const ref = this.storage.ref(path);

    await this.storage.upload(path, file);

    ref.getDownloadURL().subscribe(url => {
      this.eventForm.patchValue({ picture: url });
    });
  }

  submitEvent() {
    // const formattedDate = new Date(this.eventForm.value.date.seconds * 1000);
    const event = { ...this.eventForm.value };
    console.log('new event', event);
    this.eventService.addEvent(this.user.uid, event);
    this.editing = false;
    this.eventForm.reset();
  }

}
