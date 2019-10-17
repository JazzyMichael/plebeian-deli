import { Component, OnInit, Input } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var Stripe: any;

// prod
const stripe = Stripe('pk_live_9RFFwjYhsrCgEbkm3DBpyOv8');

// test
// const stripe = Stripe('pk_test_vWeiNQrgSgiNW9fBO2IX0EUT');

const elements = stripe.elements();

const card = elements.create('card');

@Component({
  selector: 'app-collect-payment',
  templateUrl: './collect-payment.component.html',
  styleUrls: ['./collect-payment.component.scss']
})
export class CollectPaymentComponent implements OnInit {
  @Input() price: number;
  @Input() promoCode: string;

  constructor() { }

  ngOnInit() {
  }

}
