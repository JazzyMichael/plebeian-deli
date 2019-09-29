import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';
import { NgxHmCarouselBreakPointUp } from 'ngx-hm-carousel';
import { Observable } from 'rxjs';
import { PrimeCutsService } from '../services/prime-cuts.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-prime-cuts',
  templateUrl: './prime-cuts.component.html',
  styleUrls: ['./prime-cuts.component.scss']
})
export class PrimeCutsComponent implements OnInit {
  carouselInfinite: boolean = true;
  carouselIndex: number = 0;
  carouselBreakpoints: NgxHmCarouselBreakPointUp[] = [
    {
      width: 500,
      number: 1
    },
    {
      width: 800,
      number: 2
    },
    {
      width: 1024,
      number: 3
    }
  ];
  carouselData: any[];
  viewingStudio: any;

  primePosts$: Observable<any[]>;
  featureFriday$: Observable<any>;
  featured$: Observable<any[]>;

  masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0.2s',
    gutter: 20,
    resize: true,
    initLayout: true,
    fitWidth: true
  };

  constructor(
    private primeService: PrimeCutsService,
    private titleService: Title
  ) { }

  layoutComplete(event: any) {
    // console.log('layoutComplete', event);
  }

  onScroll() {
    this.primeService.getMorePrimeCuts();
  }

  ngOnInit() {
    this.titleService.setTitle('Prime Cuts');

    this.carouselData = [
      {
        title: 'Dino Tomic',
        thumbnail: 'https://img.youtube.com/vi/wlQ3PdR83Nk/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/wlQ3PdR83Nk',
        primePostId: 'hpcYC4SE0Gzf5gMnua0e'
      },
      {
        title: 'Brian Booth Craig',
        thumbnail: 'https://img.youtube.com/vi/Wk2Ab-gHr5g/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/Wk2Ab-gHr5g',
        primePostId: '6OmX6k5X1MMOsw90kUIO'
      },
      {
        title: 'Alexis Nutini',
        thumbnail: 'https://img.youtube.com/vi/ao2bFVcdUJ8/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/ao2bFVcdUJ8',
        primePostId: 'Lo5fXc8Bsihz9LnJzamF'
      },
      {
        title: 'Phil McGaughy',
        thumbnail: 'https://img.youtube.com/vi/plziHxS7r-4/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/plziHxS7r-4',
        primePostId: 'EoHD7zlIwOs9XnxjgLeS'
      },
      {
        title: 'Lindsay Keating',
        thumbnail: 'https://img.youtube.com/vi/tOXZ4rWu5go/maxresdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/tOXZ4rWu5go',
        primePostId: 'oVoyrYxW3dilZq9zo7SR'
      }
    ];

    document.querySelector('.mat-drawer-content').scrollTop = 0;

    document.querySelector('.mat-sidenav-content').scrollTop = 0;

    this.featureFriday$ = this.primeService.featureFriday$.asObservable();

    this.primePosts$ = this.primeService.primePosts$.asObservable();

    this.featured$ = this.primeService.featuredFour$.asObservable();
  }

  click(i: number) {
    if (this.carouselIndex !== i) {
      this.carouselIndex = i;
    }
    this.viewingStudio = this.carouselData[i];
  }

  toggleViewer(showAll: boolean) {
    if (showAll) {
      this.viewingStudio = null;
    }
  }

}
