import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  allPlans: any[] = [
    { name: 'artist', id: 'plan_FiF2bn8nmyo3po' },
    { name: 'gallery', id: 'plan_FiF3rqJJrTSEcd' },
    { name: 'viewer', id: '' }
  ];
  plan: any;
  username: string;
  loggedIn: boolean;
  paymentCompleted: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const membership = params.get('membership');

      this.plan = this.allPlans.find(p => p.name === membership);

      if (!membership || !this.plan) {
        return this.router.navigateByUrl('/login');
      }
    });
  }

  usernameInput(username: string) {
    this.username = username;
  }

  googleSignUp() {
    console.log(this.username);
    this.authService.signUpWithGoogle(this.username);
    this.loggedIn = true;
  }

  facebookSignUp() {
    console.log(this.username);
    this.loggedIn = true;
  }

  onPayment(event: any) {
    console.log(event);
    this.paymentCompleted = true;
  }

}
