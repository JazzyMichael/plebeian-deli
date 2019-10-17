import { Component, OnInit } from '@angular/core';
import { StripeService } from '../services/stripe.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.component.html',
  styleUrls: ['./choose-plan.component.scss']
})
export class ChoosePlanComponent implements OnInit {
  artist: boolean;
  gallery: boolean;

  loading: boolean;

  stripeCustomerId: string = '';

  constructor(
    private stripeService: StripeService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.stripeCustomerId = await this.authService.getCurrentUser();
  }

  monthArtist() {
    this.loading = true;

    const planId = '';

    this.stripeService.signupCheckoutSubscription('artist', this.stripeCustomerId, planId);
  }

  yearArtist() {
    this.loading = true;

    const item = {};

    this.stripeService.signupCheckoutPayment('artist', this.stripeCustomerId, item);
  }

  lifeArtist() {
    this.loading = true;

    const item = {};

    this.stripeService.signupCheckoutPayment('artist', this.stripeCustomerId, item);
  }

  monthGallery() {
    this.loading = true;

    const planId = '';

    this.stripeService.signupCheckoutSubscription('gallery', this.stripeCustomerId, planId);
  }

  yearGallery() {
    this.loading = true;

    const item = {};

    this.stripeService.signupCheckoutPayment('gallery', this.stripeCustomerId, item);
  }

  lifeGallery() {
    this.loading = true;

    const item = {};

    this.stripeService.signupCheckoutPayment('gallery', this.stripeCustomerId, item);
  }

}
