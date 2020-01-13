import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user$: Observable<any>;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.user$ = this.auth.user$.asObservable();
  }

  updateDescription(description: string) {
    console.log('update description', description);
  }

  updateField(field: string, value: string) {
    console.log(field, value);
  }

}
