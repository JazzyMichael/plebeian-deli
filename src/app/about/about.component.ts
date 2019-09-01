import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  admins$: Observable<any>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.admins$ = this.userService.admins$.asObservable();
  }

}
