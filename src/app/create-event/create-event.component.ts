import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  eventImage: any;
  eventImagePreview: any;
  uploading: boolean;

  pickerFilter: any = (d: Date): boolean => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return d > today;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.createEventForm();
  }

  createEventForm(): void {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      date: [null, Validators.required],
      time: [null, Validators.required],
      link: ['']
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

  async submit() {
    this.uploading = true;

    const user = await this.auth.getCurrentUser();

    if (!user || !this.eventImage) {
      return window.alert('No user or event image');
    }

    const random = Math.random().toString().slice(3, 9);

    const imageFileType = this.eventImage.type.split('/')[1];

    const imagePath = `event-images/${user.uid.substring(0, 10)}-${random}.${imageFileType}`;

    const ref = this.storage.ref(imagePath);

    const metadata = { customMetadata: { userId: user.uid } };

    await this.storage.upload(imagePath, this.eventImage, metadata);

    const imageUrl = await ref.getDownloadURL().toPromise();

    const thumbnailStoragePathBase = `event-images/thumbnails/${user.uid.substring(0, 10)}-${random}`;

    const thumbnailStoragePath = `${thumbnailStoragePathBase}_250x250.${imageFileType}`;

    const newEvent = {
      ...this.eventForm.value,
      thumbnailStoragePath,
      thumbnailStoragePathBase,
      imageUrl,
      imagePath,
      imageFileType,
      createdTimestamp: new Date(),
      userId: user.uid
    };

    await this.eventService.addEvent(newEvent);

    this.snackBar.open('Event has been added to the Calendar!', '', { duration: 2000 });

    this.router.navigateByUrl('/calendar');
  }

}