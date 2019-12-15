import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.scss']
})
export class SignupSuccessComponent implements OnInit {
  membership: string;

  user$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.membership = params.membership;
    });

    this.user$ = this.auth.user$.asObservable();
  }

}
