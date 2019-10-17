import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var Stripe: any;

// prod
const stripe = Stripe('pk_live_9RFFwjYhsrCgEbkm3DBpyOv8');
// test
// const stripe = Stripe('pk_test_vWeiNQrgSgiNW9fBO2IX0EUT');

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private func: AngularFireFunctions) { }

  redirectToCheckout(sessionId: string) {
    stripe.redirectToCheckout({ sessionId }).then(result => {
      // const errMsg = result.error.message;
      console.log('redirectToCheckout result', result);
    });
  }

  async signupCheckoutPayment(membership: string, customerId: string = '', item: any) {
    const sessionId = await this.func
      .httpsCallable('signupCheckoutSession')({
        membership,
        customerId,
        item,
        paymentCheckout: true
      })
      .toPromise();

    this.redirectToCheckout(sessionId);
  }

  async signupCheckoutSubscription(membership: string, customerId: string = '', planId: string) {
    const sessionId = await this.func
      .httpsCallable('signupCheckoutSession')({
        membership,
        customerId,
        planId,
        subscriptionCheckout: true
      })
      .toPromise();

    this.redirectToCheckout(sessionId);
  }


  // connectCheckout

  // cartCheckout
}
