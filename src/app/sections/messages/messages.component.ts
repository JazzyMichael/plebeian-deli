import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  title: string;
  profilePic: string;

  constructor() { }

  ngOnInit(): void {
    this.title = 'Messages' || 'New Message' || 'Username';
    this.profilePic = 'url' || '';
  }

}
