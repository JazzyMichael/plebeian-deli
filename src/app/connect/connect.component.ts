import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
  stripeCredentialsUrl = 'https://connect.stripe.com/oauth/token';
  clientSecret = 'sk_test_EivFXuy6nOXJYZ7ScayMi2rK';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fun: AngularFireFunctions
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params.error) {
        window.alert('Stripe Setup with Plebeian is incomplete');
        return this.router.navigateByUrl('/seller');
      }

      console.log('params', params);

      const scope = params.scope;
      const authorizationCode = params.code;

      // post request to get seller credentials from stripe

      const res = await this.fun
        .httpsCallable('createSellerAccount')({ code: authorizationCode })
        .toPromise();

      console.log('create seller res', res);

      return this.router.navigateByUrl('/seller');
    });
  }

}
