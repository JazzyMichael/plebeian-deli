import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  // test
  // allPlans: any[] = [
  //   { name: 'artist', id: 'plan_FiF2bn8nmyo3po' },
  //   { name: 'gallery', id: 'plan_FiF3rqJJrTSEcd' },
  //   { name: 'viewer', id: '' }
  // ];
  // prod
  allPlans: any[] = [
    { name: 'artist', id: 'plan_Fh9pZk60eSj9ml' },
    { name: 'gallery', id: 'plan_Fh9p0UaJGtlU7o' },
    { name: 'viewer', id: '' }
  ];

  plan: any = { name: 'artist', id: 'plan_Fh9pZk60eSj9ml' };
  membership: string = 'artist';
  paymentCompleted: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  onMembershipChange() {
    this.plan = this.allPlans.find(p => p.name === this.membership);
  }

  async onPayment(event: any) {
    this.paymentCompleted = true;
    const user = await this.authService.user$.pipe(first()).toPromise();
    this.router.navigateByUrl(`/${user.username}`);
  }

}
