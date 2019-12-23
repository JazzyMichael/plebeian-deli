import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user: any = { description: '' };

  constructor() { }

  ngOnInit() {
  }

  updateDescription(description: string) {
    console.log('update description', description);
  }

}
