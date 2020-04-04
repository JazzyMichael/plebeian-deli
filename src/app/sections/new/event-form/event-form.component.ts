import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnDestroy {
  editingEvent: any;
  uploading: boolean;
  eventForm: FormGroup;
  eventImage: any;
  eventImagePreview: any;

  pickerFilter: any = (d: Date): boolean => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return d > today;
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.editingEvent = this.eventService.editingEvent || null;
    this.createEventForm();
  }

  ngOnDestroy(): void {
    this.eventService.editingEvent = null;
  }

  createEventForm(): void {
    this.eventForm = this.fb.group({
      title: [this.editingEvent && this.editingEvent.title || '', Validators.required],
      description: [this.editingEvent && this.editingEvent.description || '', Validators.required],
      location: [this.editingEvent && this.editingEvent.location || '', Validators.required],
      date: [this.editingEvent && this.editingEvent.date || null, Validators.required],
      time: [this.editingEvent && this.editingEvent.time || null, Validators.required],
      link: [this.editingEvent && this.editingEvent.link || '']
    });
    this.eventService.editingEvent = null;
    this.eventImagePreview = this.editingEvent && this.editingEvent.imageUrl || null;
  }

  async uploadEventPic(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      this.snackBar.open('Only Images Are Allowed!', '', { duration: 4000 });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.eventImage = file;
      this.eventImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async submit() {
    this.uploading = true;

    const res = this.editingEvent ?
      await this.eventService.updateEvent(this.editingEvent.eventId, { updatedTimestamp: new Date(), ... this.eventForm.value }) :
      await this.eventService.saveNewEvent(this.eventImage, this.eventForm.value);

    this.snackBar.open('Event saved on the Calendar!', '', { duration: 3000 });
    this.router.navigateByUrl('/calendar');
  }

}
