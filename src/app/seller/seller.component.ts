import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {
  connectBaseUrl = 'https://connect.stripe.com/oauth/authorize?';
  responseType = 'response_type=code';
  clientId = '&client_id=ca_Fh9rZqqdVbgofzaWlXpPHyNcrno2iXnY';
  // clientId = '&client_id=ca_Fh9rJPQapCoKCcWgClCGJtY6pBesglFu';
  scope = '&scope=read_write';

  user: any;
  approvedSeller: boolean = false;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    this.user = await this.authService.getCurrentUser();

    // this.approvedSeller = this.user && this.user.approvedSeller;
  }

  connectClick() {
    const url = `${this.connectBaseUrl}${this.responseType}${this.clientId}${this.scope}`;
    window.open(url);
  }

  saveOrderMessage(msg: string) {
    console.log(msg);
  }

}
