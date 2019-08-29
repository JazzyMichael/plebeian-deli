import { Component, OnInit } from '@angular/core';

declare const fbq: any;

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  plans: any[];

  constructor() { }

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
        subtitle: 'Subtitle for Galleries',
        price: 10,
        perks: [
          'Share events on the Plebeian Calendar',
          'Interact with members'
        ]
      }
    ];
  }

  selectSubscription() {
    console.log('subscribe');
    // try {
    //   fbq('track', 'Subscribe', {
    //     value: '1.00',
    //     currency: 'USD',
    //     predicted_ltv: '20'
    //   });
    // } catch (e) {
    //   console.log('fbq Subscribe error', e);
    // }
  }

}
