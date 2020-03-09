import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  facebookUrl = 'https://www.facebook.com/PlebeianDeli/';
  instagramUrl = 'https://www.instagram.com/plebeian_deli/';
  twitterUrl = 'https://twitter.com/PlebeianDeli';
  youtubeUrl = 'https://www.youtube.com/channel/UCFMjQK8nIrXFHAlxRPAQvIA';

  constructor() { }

  openFacebook() {
    window.open(this.facebookUrl, '_blank');
  }

  openInstagram() {
    window.open(this.instagramUrl, '_blank');
  }

  openTwitter() {
    window.open(this.twitterUrl, '_blank');
  }

  openYoutube() {
    window.open(this.youtubeUrl, '_blank');
  }

}
