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
  swiperConfig: any = {
    loop: true,
    loopedSlides: 6,
    slidesPerView: 1,
    autoplay: true
  };
  slides: string[];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.userSub = this.auth.user$.subscribe(user => {
      if (user) {
        this.auth.navigateToProfile();
      }
    });

    this.slides = [
      'I found I could say things with color and shapes that I couldnt say any other way - things I had no words for.',
      'Marks on paper are free - free speech - press - pictures all go together I suppose.',
      'Painting is poetry that is seen rather than felt, and poetry is painting that is felt rather than seen.'
    ];
  }

  ngAfterViewInit() {
    const swiper = document.querySelector('.swiper-container');
    const swiperPrev = document.querySelector('.swiper-button-prev') as HTMLElement;
    const swiperNext = document.querySelector('.swiper-button-next') as HTMLElement;
    swiper['swiper'].loopCreate();
    swiperPrev.style.display = 'none';
    swiperNext.style.display = 'none';
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
