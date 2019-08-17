import { Component, OnInit } from '@angular/core';

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
        title: 'Viewer',
        subtitle: 'Free',
        price: 0,
        perks: [
          'Interact with the community',
          'Notified about emerging artists and local events'
        ]
      },
      {
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
        title: 'Gallery',
        subtitle: 'Subtitle for Galleries',
        price: 10,
        perks: [
          'Post Work in the Deli',
          'Share events on the Plebeian Calendar',
          'Invite and interact with members'
        ]
      }
    ];
  }

}
