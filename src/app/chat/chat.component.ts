import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable, Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  user: any;
  showChats: boolean;
  viewingChat: any;
  newChatMessage: string;
  chatsSub: Subscription;
  chats: any[];
  singleChat$: Observable<any>;
  darkTheme: boolean;
  newMessages: number = 0;

  constructor(
    public chatService: ChatService,
    private router: Router,
    private auth: AuthService
    ) { }

  ngOnDestroy() {
    if (this.chatsSub) {
      this.chatsSub.unsubscribe();
    }
  }

  ngOnInit() {

    this.newChatMessage = '';

    this.chatsSub = this.chatService.userChats$.asObservable()
      .pipe(
        switchMap(async chats => {
          console.log('chat sub', [...chats]);

          this.newMessages = 0;

          const user = await this.auth.getCurrentUser();

          if (!user) {
            return chats || [];
          }

          for await (let chat of chats) {

            const userObj = chat.users.find(u => u.uid === user.uid);

            let newMessage = false;

            let newMessageCount = 0;

            for (const message of chat.messages) {
              if (message.uid !== userObj.uid && (message.timestamp > userObj.lastViewedTimestamp)) {
                console.log('new message', message);
                newMessage = true;
                this.newMessages++;
                newMessageCount++;
                console.log('newMessages', this.newMessages);
              }
            }

            chat['newMessage'] = newMessage;
            chat['newMessageCount'] = newMessageCount;
          }

          return chats;

        }),
        tap(chats => console.log('chit chats', chats)),
        tap(chats => {
          let noNew = true;
          chats.forEach(chat => {
            if (chat.newMessage) {
              noNew = false;
            }
          });
          if (noNew) {
            this.newMessages = 0;
          }
        })
      )
      .subscribe(chats => this.chats = chats);
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
  }

  messagesToggle() {
    this.showChats = !this.showChats;
    if (!this.showChats) {
      if (this.viewingChat) {
        this.updateUserLastViewed({ ...this.viewingChat });
      }
      this.viewingChat = null;
    }
  }

  viewChat(chat: any) {
    this.viewingChat = chat;

    if (chat.newMessageCount) {
      this.newMessages -= chat.newMessageCount;
      if (this.newMessages && this.newMessages < 0) {
        this.newMessages = 0;
      }
    }

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
    // this.updateUserLastViewed({ ...this.viewingChat });

    this.viewingChat = null;
  }

  updateUserLastViewed(chat: any) {
    return;
    // // find user in chat.users
    // let userObj = chat.users.find(u => u.uid === this.user.uid);
    // // update lastViewedTimestamp
    // const newTimestamp = Date.now();
    // userObj.lastViewedTimestamp = newTimestamp;
    // // update chat doc
    // let newUsersArr = chat.users;
    // let index = newUsersArr.findIndex(u => u.uid === this.user.uid);
    // newUsersArr[index].lastViewedTimestamp = Date.now();

    // if (chat.messagesCount) {
    //   this.newMessages -= chat.newMessageCount;
    //   if (this.newMessages && this.newMessages < 0) {
    //     this.newMessages = 0;
    //   }
    // }

    // this.chatService.updateChat(chat.id, { users: newUsersArr });
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

    const user = this.viewingChat.users.find(user => {
      return user.uid !== this.viewingChat.otherUser.uid;
    });

    const fullMessage = {
      content: this.newChatMessage,
      timestamp: Date.now(),
      userId: user.uid
    };

    console.log(fullMessage);

    this.chatService.addChatMessage(this.viewingChat.id, [ ...this.viewingChat.messages, fullMessage ]);

    this.newChatMessage = '';
  }

}
