import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactService } from 'src/app/services/contact.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact-messages',
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.scss']
})
export class ContactMessagesComponent implements OnInit {
  msgs$: Observable<any[]>;

  constructor(private cs: ContactService, private auth: AuthService) { }

  ngOnInit(): void {
    this.msgs$ = this.cs.getMessages();
  }

  async acknowledgedToggle(event: any, msgId: string) {
    const status = event.checked;
    const { username } = await this.auth.getCurrentUser();
    await this.cs.toggleAcknowledge(msgId, status, username);
  }

}
