import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var Stripe: any;

// prod
const stripe = Stripe('pk_live_9RFFwjYhsrCgEbkm3DBpyOv8');
// test
// const stripe = Stripe('pk_test_vWeiNQrgSgiNW9fBO2IX0EUT');
const elements = stripe.elements();

const card = elements.create('card');

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements AfterViewInit, OnDestroy {
  @Input() plan: any; // { name: '', id: '' };

  @Output() paymentCompleted: EventEmitter<any> = new EventEmitter();

  @ViewChild('cardForm', { static: false }) cardForm: ElementRef;

  promoCode: string;

  coupons: any[] = ['LOYALTYCLUB'];

  validCoupon: any;

  loading: boolean;
  complete: boolean;

  constructor(private fun: AngularFireFunctions) { }

  ngAfterViewInit() {
    card.mount(this.cardForm.nativeElement);
  }

  ngOnDestroy() {
    try {
      card.unmount(this.cardForm.nativeElement);
    } catch (e) {
      console.log('unmount', e);
    }
  }

  async handleForm(e: any) {
    e.preventDefault();

    const { token, error } = await stripe.createToken(card);

    if (error) {
      console.log('error', error);
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = JSON.stringify(error);
    } else {
      this.loading = true;

      const res = await this.fun
        .httpsCallable('startSubscription')({
          source: token.id,
          planId: this.plan.id,
          promoCode: this.validCoupon ? this.promoCode : null,
          planName: this.plan.name
        })
        .toPromise();

      this.paymentCompleted.emit(true);

      this.complete = true;
      this.loading = false;
    }
  }

  onPromoCodeChange() {
    this.validCoupon = this.coupons.find(coup => coup === this.promoCode);
  }

}
