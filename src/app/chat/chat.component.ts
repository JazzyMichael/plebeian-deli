import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

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
  darkTheme: boolean;

  constructor(
    public chatService: ChatService,
    private router: Router,
    private themeService: ThemeService
    ) { }

  ngOnInit() {
    this.newChatMessage = '';

    this.chats$ = this.chatService.userChats$.asObservable()
      // .pipe(
      //   tap(chats => {

      //     for (let chat of chats) {

      //       const 

      //     }

      //   })
      // );
    // pipe
    // loop through all chats
      // find user in user array
      // check lastViewedTimestamp
      // compare with last index in messages array timestamp

    this.chatService.openChatBox$.subscribe(chatToOpen => {
      this.showChats = true;
      this.viewChat(chatToOpen);
    });

    this.chatService.openMessagesBox$.subscribe(bool => {
      this.showChats = true;
      this.viewingChat = null;
    });

    this.themeService.isDarkTheme.subscribe(isDark => {
      this.darkTheme = isDark;
    });
  }

  messagesToggle() {
    this.showChats = !this.showChats;
    if (!this.showChats) {
      this.viewingChat = null;

      // update last viewed for that chat
    }
  }

  viewChat(chat: any) {
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

    // update chat users array last viewed for logged in user

    // get viewingCha
  }

  viewUserProfile(username: string) {
    this.router.navigateByUrl(`/${username}`);
  }

  sendMessage() {
    if (!this.newChatMessage) {
      return;
    }

    this.newChatMessage = this.newChatMessage.trim();

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
