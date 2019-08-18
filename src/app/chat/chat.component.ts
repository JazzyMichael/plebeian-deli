import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  showChats: boolean;
  viewingChat: any;

  constructor(public chatService: ChatService) { }

  ngOnInit() {
  }

  messagesToggle() {
    this.showChats = !this.showChats;
    if (!this.showChats) {
      this.viewingChat = null;
    }
  }

  viewChat(chat: any) {
    this.viewingChat = chat;
  }

  goBack() {
    this.viewingChat = null;
  }

}
