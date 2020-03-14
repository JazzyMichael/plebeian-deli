import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  userSub: Subscription;
  slides: string[];
  swiperConfig: any = {
    loop: true,
    slidesPerView: 1,
    autoplay: true,
    pagination: true
  };

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      if (user) {
        this.auth.navigateToProfile();
      }
    });

    this.slides = [
      'Buy: Art from real independent artists all over the world',
      'Sell: To an audience you may never have had access to easier than ever',
      'Network: With a vast and growing collection of artists looking to change art for the better',
      'Experience: The New Art Market'
    ];
  }

  ngAfterViewInit() {
    const swiper = document.querySelector('.swiper-container');
    const swiperPrev = document.querySelector('.swiper-button-prev') as HTMLElement;
    const swiperNext = document.querySelector('.swiper-button-next') as HTMLElement;
    if (swiper && swiper['swiper']) swiper['swiper'].loopCreate();
    if (swiperPrev) swiperPrev.style.display = 'none';
    if (swiperNext) swiperNext.style.display = 'none';
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  appleLogin() {
    alert('Apple Login Coming Soon!');
  }

  googleLogin() {
    this.auth.loginWithGoogle();
  }

  facebookLogin() {
    this.auth.loginWithFacebook();
  }

}
