import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit, AfterViewChecked, OnDestroy {
  connectBaseUrl = 'https://connect.stripe.com/oauth/authorize?';
  responseType = 'response_type=code';
  clientId = '&client_id=ca_Fh9rZqqdVbgofzaWlXpPHyNcrno2iXnY';
  // clientId = '&client_id=ca_Fh9rJPQapCoKCcWgClCGJtY6pBesglFu';
  scope = '&scope=read_write';

  userSub: Subscription;
  user: any;
  approvedSeller: boolean;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.userSub = this.authService.user$.asObservable().subscribe(user => {
      this.user = user;
      this.approvedSeller = this.user ? true : false;
    });
  }

  ngAfterViewChecked(){
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  connectClick() {
    const url = `${this.connectBaseUrl}${this.responseType}${this.clientId}${this.scope}`;
    window.open(url);
  }

  async saveOrderMessage(orderPlacedMessage: string) {
    await this.userService.updateUserPromise(this.user.uid, { orderPlacedMessage });
    this.snackBar.open('Message Updated!', '', { duration: 2000 });
  }

}
