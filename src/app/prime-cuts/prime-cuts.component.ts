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
      { title: 'Phil McGaughy', thumbnail: 'assets/images/phil-mcgaughy-thumbnail.jpg', videoUrl: this.getPhotoUrl('https://www.youtube.com/embed/plziHxS7r-4'), backgroundColor: 'red' },
      { title: 'Lindsay Keating', thumbnail: 'assets/images/lindsey-keating-thumbnail.jpg', videoUrl: this.getPhotoUrl('https://www.youtube.com/embed/tOXZ4rWu5go'), backgroundColor: 'green' },
      // { title: 'aye 3', videoUrl: this.getPhotoUrl('https://www.youtube.com/embed/plziHxS7r-4'), backgroundColor: 'blue' },
      // { title: 'aye 4', videoUrl: this.getPhotoUrl('https://www.youtube.com/embed/tOXZ4rWu5go'), backgroundColor: 'yellow' },
      // { title: 'aye 5', videoUrl: this.getPhotoUrl('https://www.youtube.com/embed/plziHxS7r-4'), backgroundColor: 'gray' },
      // { title: 'aye 6', videoUrl: this.getPhotoUrl('https://www.youtube.com/embed/tOXZ4rWu5go'), backgroundColor: 'orange' }
    ];
  }

  click(i: number) {
    if (this.carouselIndex !== i) {
      this.carouselIndex = i;
    }
    this.viewingStudio = this.carouselData[i];
  }

  getPhotoUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleViewer(showAll: boolean) {
    if (showAll) {
      this.viewingStudio = null;
    }
  }

}
