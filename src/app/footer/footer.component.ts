import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  facebookUrl = 'https://www.facebook.com/PlebeianDeli/';
  instagramUrl = 'https://www.instagram.com/plebeian_deli/';
  twitterUrl = 'https://twitter.com/PlebeianDeli';
  youtubeUrl = 'https://www.youtube.com/channel/UCFMjQK8nIrXFHAlxRPAQvIA';

  constructor() { }

  ngOnInit() {
  }

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
