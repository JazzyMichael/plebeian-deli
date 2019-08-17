import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from './services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  admin: boolean;
  testChats: any[];
  showMessages: boolean;
  viewingChat: any;
  chats$: Observable<any>;

  constructor(private router: Router, private chatService: ChatService) {
    this.router.events.subscribe(x => {
      this.admin = this.router.url === '/admin'
        || this.router.url === '/admin/new-post'
        || this.router.url === '/admin/featured'
        || this.router.url === '/admin/exhibitions'
        || this.router.url === '/admin/studios'
        || this.router.url === '/admin/promo-codes'
        || this.router.url === '/admin/store'
        || this.router.url === '/admin/more'
        || this.router.url === 'admin';
    });

    this.chats$ = this.chatService.userChats$.asObservable();

    this.testChats = [
      { username: 'mike', messages: 'aye a message' },
      { username: 'joey', messages: 'hey its a message' },
      { username: 'forest', messages: 'message' },
      { username: 'jeremy', messages: 'yo message' },
      { username: 'james', messages: 'here is a message' },
    ];
  }

  messagesToggle() {
    return;
    // this.showMessages = !this.showMessages;
  }

  viewChat(chat: any) {
    this.viewingChat = chat;
  }

  goBack() {
    this.viewingChat = null;
  }

  onSwipeRight(event: any) {
    console.log(event);
  }
}
