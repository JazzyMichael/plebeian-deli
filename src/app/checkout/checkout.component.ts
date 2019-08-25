import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  membership: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.membership = params.get('membership');

      if (!this.membership) {
        return this.router.navigateByUrl('/login');
      }
    });
  }

}
