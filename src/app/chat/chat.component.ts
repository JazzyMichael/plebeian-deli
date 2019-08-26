import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  showChats: boolean;
  viewingChat: any;
  newChatMessage: string;
  chats$: Observable<any>;
  singleChat$: Observable<any>;

  constructor(public chatService: ChatService) { }

  ngOnInit() {
    this.chats$ = this.chatService.userChats$.asObservable();

    this.newChatMessage = '';
  }

  messagesToggle() {
    this.showChats = !this.showChats;
    if (!this.showChats) {
      this.viewingChat = null;
    }
  }

  viewChat(chat: any) {
    console.log('viewChat');

    this.viewingChat = chat;

    this.singleChat$ = this.chatService.watchSingleChat(this.viewingChat.id)
      .pipe(tap(newChat => {
        this.viewingChat = { ...this.viewingChat, ... newChat };
        setTimeout(() => {
          const objDiv = document.querySelector('.messages-container');
          objDiv.scrollTop = objDiv.scrollHeight;
        });
      }));
  }

  goBack() {
    this.viewingChat = null;
  }

  sendMessage() {
    if (!this.newChatMessage) {
      return;
    }

    const userId = this.viewingChat.users.find(uid => {
      return uid !== this.viewingChat.otherUser.uid;
    });

    const fullMessage = {
      content: this.newChatMessage,
      timestamp: new Date(),
      userId
    };

    console.log(fullMessage);

    this.chatService.addChatMessage(this.viewingChat.id, [ ...this.viewingChat.messages, fullMessage ]);

    this.newChatMessage = '';
  }

}
