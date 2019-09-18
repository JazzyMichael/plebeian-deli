import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  features: any[];
  selectedFeature: any;

  constructor() { }

  ngOnInit() {
    this.features = [
      {
        name: 'Prime Cuts',
        icon: 'assets/images/ham-icon.svg',
        color: 'accent',
        bigText: 'I\'m a dreamer. I have to dream and reach for the stars, and if I miss a star then I grab a handful of clouds.',
        author: 'Mike Tyson',
        firstBlob: 'Lorem ipsum dolor sit semper amet, consectetur adipiscing elit. In maximus ligula metus pellentesque mattis. Donec vel ultricies purus.',
        secondBlob: 'Pellentesque suscipit ante at ullamcorper pulvinar neque porttitor. Integer lectus. Etiam sit amet fringilla lacus. Maecenas volutpat, diam enim sagittis quam, id porta quam.',
        link: '/prime-cuts'
      },
      {
        name: 'Deli',
        icon: 'assets/images/tv-icon.svg',
        color: 'primary',
        bigText: 'I don\’t understand why people would want to get rid of pigeons. They don\’t bother no one.',
        author: 'Mike Tyson',
        firstBlob: 'Lorem ipsum dolor sit semper amet, consectetur adipiscing elit. In maximus ligula metus pellentesque mattis. Donec vel ultricies purus.',
        secondBlob: 'Pellentesque suscipit ante at ullamcorper pulvinar neque porttitor. Integer lectus. Etiam sit amet fringilla lacus. Maecenas volutpat, diam enim sagittis quam, id porta quam.',
        link: '/deli'
      },
      {
        name: 'Calendar',
        icon: 'assets/images/calendar-icon.png',
        color: 'light',
        bigText: 'Everyone has a plan \’till they get punched in the mouth.',
        author: 'Mike Tyson',
        firstBlob: 'Lorem ipsum dolor sit semper amet, consectetur adipiscing elit. In maximus ligula metus pellentesque mattis. Donec vel ultricies purus.',
        secondBlob: 'Pellentesque suscipit ante at ullamcorper pulvinar neque porttitor. Integer lectus. Etiam sit amet fringilla lacus. Maecenas volutpat, diam enim sagittis quam, id porta quam.',
        link: '/calendar'
      }
    ];

    this.selectFeature(0);
  }

  selectFeature(index: number) {
    this.selectedFeature = this.features[index];
  }

}
