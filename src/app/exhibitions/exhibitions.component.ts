import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exhibitions',
  templateUrl: './exhibitions.component.html',
  styleUrls: ['./exhibitions.component.scss']
})
export class ExhibitionsComponent implements OnInit {
  exhibitions: any[];
  selected: any;
  totalPages: number;
  page: number;

  constructor() { }

  ngOnInit() {
    this.exhibitions = [
      {
        date: 'April 2019',
        cover: 'assets/images/cover-april-2019.webp',
        download: 'assets/exhibition-april-2019.pdf'
      },
      {
        date: 'May 2019',
        cover: 'assets/images/cover-may-2019.webp',
        download: 'assets/exhibition-may-2019.pdf'
      },
      {
        date: 'June 2019',
        cover: 'assets/images/cover-june-2019.webp',
        download: 'assets/exhibition-june-2019.pdf'
      }
    ];

    this.selected = this.exhibitions[0];
  }

  select(exhibition: any) {
    this.selected = exhibition;
  }

  loaded(pdf: any) {
    this.totalPages = pdf._pdfInfo.numPages;
    this.page = 1;
  }

  nextPage() {
    this.page++;
    setTimeout(() => {
      document.querySelector('.main-container').scrollTop = 0;
    }, 100);
  }

  previousPage() {
    this.page--;
    setTimeout(() => {
      document.querySelector('.main-container').scrollTop = 0;
    }, 100);
  }

}
