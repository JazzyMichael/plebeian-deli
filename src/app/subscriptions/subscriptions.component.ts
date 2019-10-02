import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AnalyticsService } from '../services/analytics.service';

declare const fbq: any;

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  plans: any[];

  constructor(
    private auth: AuthService,
    private analytics: AnalyticsService,
    private router: Router
    ) { }

  ngOnInit() {
    this.plans = [
      {
        membership: 'viewer',
        title: 'Viewer',
        subtitle: 'Free',
        price: 0,
        perks: [
          'Interact with the community',
          'Notified about emerging artists and local events'
        ]
      },
      {
        membership: 'artist',
        title: 'Artist',
        subtitle: 'Boost your work',
        price: 1,
        perks: [
          'Post work in the Deli',
          'Interact with other members to share and sell your art',
          'Eligible for submission in site exhibitions & contests'
        ]
      },
      {
        membership: 'gallery',
        title: 'Gallery',
        subtitle: 'Share Events!',
        price: 10,
        perks: [
          'Share events on the Plebeian Calendar',
          'Interact with members of the community'
        ]
      }
    ];
  }

  async selectSubscription() {
    console.log('selectSubscription');

    const user = await this.auth.getCurrentUser();

    if (!user) {
      window.alert('Sign In to get started!');
      this.router.navigateByUrl('/login');
    } else {
      this.router.navigateByUrl('/checkout');
    }

    this.analytics.addToCart();
  }

}
