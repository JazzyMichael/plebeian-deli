import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-inquire-form',
  templateUrl: './inquire-form.component.html',
  styleUrls: ['./inquire-form.component.scss']
})
export class InquireFormComponent implements OnInit {
  description: string;
  images: any[] = [];
  loading: boolean;

  constructor(
    private storage: AngularFireStorage,
    public dialogRef: MatDialogRef<InquireFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
  }

  addImage(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      window.alert('Only Image files are allowed');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.images.push({ file, url: e.target.result });
    };

    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  async submit() {
    this.loading = true;

    const images = [];

    for await (const img of this.images) {
      const random = Math.random().toString().slice(0, 10);

      const path = `service-images/${random}`;

      const ref = this.storage.ref(path);

      await this.storage.upload(path, img.file);

      const url = await ref.getDownloadURL().toPromise();

      images.push({ url });
    }

    this.loading = false;

    this.dialogRef.close({
      orderDescription: this.description,
      orderImages: images
    });
  }

  close() {
    this.dialogRef.close();
  }

}
