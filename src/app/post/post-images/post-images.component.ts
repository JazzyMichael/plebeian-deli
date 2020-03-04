import { Component, Input, AfterViewInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-post-images',
  templateUrl: './post-images.component.html',
  styleUrls: ['./post-images.component.scss']
})
export class PostImagesComponent implements OnChanges, AfterViewInit {

  @Input() images: any[];

  swiperConfig: any = {
    slidesPerView: 1,
    autoplay: true,
    pagination: true
  };

  constructor() { }

  ngOnChanges() {
    setTimeout(() => {
      if (this.images && this.images.length < 2) {
        document.querySelectorAll('.swiper-pagination-bullet').forEach((bullet: HTMLElement) => {
          bullet.style.display = 'none';
        });
      }
    }, 777);
  }

  ngAfterViewInit() {
    const swiperPrev = document.querySelector('.swiper-button-prev') as HTMLElement;
    const swiperNext = document.querySelector('.swiper-button-next') as HTMLElement;
    swiperPrev.style.display = 'none';
    swiperNext.style.display = 'none';
  }

}
