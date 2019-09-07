import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-inquire-form',
  templateUrl: './inquire-form.component.html',
  styleUrls: ['./inquire-form.component.scss']
})
export class InquireFormComponent implements OnInit {
  description: string;
  images: any[] = [];

  constructor(
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

  submit() {
    //
  }

  close() {
    this.dialogRef.close();
  }

}
