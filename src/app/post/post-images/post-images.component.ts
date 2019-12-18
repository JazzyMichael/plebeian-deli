import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-images',
  templateUrl: './post-images.component.html',
  styleUrls: ['./post-images.component.scss']
})
export class PostImagesComponent implements OnInit {

  @Input() images: any[];

  carouselIndex = 0;

  constructor() { }

  ngOnInit() {
  }

}
