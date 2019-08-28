import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  @Input() user: any;
  @Input() editable: boolean;

  events$: Observable<any>;

  eventForm: FormGroup;
  editing: boolean;
  pickerFilter: any;
  eventImage: any;
  eventImagePreview: any;

  constructor(private eventService: EventService, private storage: AngularFireStorage) {
    this.pickerFilter = (d: Date): boolean => {
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return d > today;
    };
  }

  ngOnInit() {
    if (this.editable) {
      this.createEventForm();
    }

    this.events$ = this.eventService.getGalleryEvents(this.user.uid);
  }

  createEventForm() {
    this.eventForm = new FormGroup({
      title: new FormControl(),
      location: new FormControl(),
      date: new FormControl(),
      time: new FormControl(),
      description: new FormControl(),
      link: new FormControl()
    });
  }

  async uploadEventPic(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('Only Images are allowed for event picture');
      return;
    }

    this.eventImage = file;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.eventImagePreview = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  async submitEvent() {
    this.editing = false;

    const random = Math.random().toString().slice(2, 10);

    const path = `event-pictures/${this.user.uid}-${random}`;

    const ref = this.storage.ref(path);

    await this.storage.upload(path, this.eventImage);

    const url = await ref.getDownloadURL().toPromise();

    const event = {
      ...this.eventForm.value,
      galleryId: this.user.uid,
      imageUrl: url,
      createdTimestamp: new Date()
    };

    this.eventService.addEvent(event)
      .then(res => {
        this.eventForm.reset();
        this.eventImage = null;
        this.eventImagePreview = null;
      })
      .catch(e => console.log('error adding event', e));
  }

}
