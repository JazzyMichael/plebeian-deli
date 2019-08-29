import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

declare var Stripe: any;

const stripe = Stripe('pk_test_vWeiNQrgSgiNW9fBO2IX0EUT');
const elements = stripe.elements();

const card = elements.create('card');

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements AfterViewInit {
  @Input() plan: any; // { name: '', id: '' };

  @Output() paymentCompleted: EventEmitter<any> = new EventEmitter();

  @ViewChild('cardForm', { static: false }) cardForm: ElementRef;

  constructor(private fun: AngularFireFunctions) { }

  ngAfterViewInit() {
    card.mount(this.cardForm.nativeElement);
  }

  async handleForm(e: any) {
    e.preventDefault();

    const { token, error } = await stripe.createToken(card);

    if (error) {
      const errorElement = document.getElementById('card-errors');
      errorElement.textContent = error.message;
    } else {
      const res = await this.fun
        .httpsCallable('startSubscription')({ source: token.id, planId: this.plan.id })
        .toPromise();

      console.log(res);

      this.paymentCompleted.emit(true);
    }
  }

}
