import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxHmCarouselBreakPointUp } from 'ngx-hm-carousel';

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

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.carouselData = [
      {
        title: 'Phil McGaughy',
        thumbnail: 'assets/images/phil-mcgaughy-thumbnail.jpg',
        videoUrl: 'https://www.youtube.com/embed/plziHxS7r-4'
      },
      {
        title: 'Lindsay Keating',
        thumbnail: 'assets/images/lindsey-keating-thumbnail.jpg',
        videoUrl: 'https://www.youtube.com/embed/tOXZ4rWu5go'
      },
      {
        title: 'Alexis Nutini',
        thumbnail: 'assets/images/alexis-nutini-thumbnail.jpg',
        videoUrl: 'https://www.youtube.com/embed/ao2bFVcdUJ8'
      }
    ];
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