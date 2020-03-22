import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {

  recipientId: string;
  username: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private chatService: ChatService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.recipientId = params.get('id');
      this.username = params.get('username');

      if (!this.recipientId || !this.username) {
        return this.router.navigateByUrl('/messages');
      }
    });
  }

  async initiateChat(msg: string) {
    const { uid } = await this.auth.getCurrentUser();

    await this.chatService.createChat(uid, this.recipientId, msg);

    this.snackbar.open('Message sent, happy chatting!', '', { duration: 4000 });

    this.router.navigateByUrl(`/messages/${this.recipientId}`);
  }

}
