import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  selectedFeature: any;
  features: any[] = [
    {
      name: 'Prime Cuts',
      icon: 'assets/images/ham-250.png',
      color: '#f09091',
      bigText: 'I\'m a dreamer. I have to dream and reach for the stars, and if I miss a star then I grab a handful of clouds.',
      author: 'Mike Tyson',
      firstBlob: 'This is our blog section where we produce daily content all about what’s going on in art. Interviews, features, what’s going on in art, some history, anything and everything art we cover it here!',
      secondBlob: 'All the information you need without the bore… and some jokes.  We have an ever growing list of writers and contributors who not only want to inform but also entertain you and give a little bit of personality.',
      externalLink: 'https://www.plebeian.us/blog'
    },
    {
      name: 'Deli',
      icon: 'assets/images/tv-250.png',
      color: '#90d0ae',
      bigText: 'I don\’t understand why people would want to get rid of pigeons. They don\’t bother no one.',
      author: 'Mike Tyson',
      firstBlob: 'The center for all of your work to be seen, talked about, and sold (if you choose). The Deli is where you can interact with others, find new work, and build a life changing community.',
      secondBlob: 'You can run your entire art business through this tool, right here. You can show all of your work right here! Ditch the archaic system of old and invest in the future of the art market today.',
      link: '/deli'
    },
    {
      name: 'Calendar',
      icon: 'assets/images/calendar-250.png',
      color: '#8aaaf4',
      bigText: 'Everyone has a plan \’till they get punched in the mouth.',
      author: 'Mike Tyson',
      firstBlob: 'Our calendar is where you can find absolutely every event that we’re a part of or supporting. Shows and events featuring our friends, the schools and galleries we work with all have a space here.',
      secondBlob: 'It’s also a nifty log of all the show cards we collect. From here you can also find all the institutions that we partner with, both galleries and schools, and get linked up with their individual sites.',
      link: '/calendar'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.selectFeature(0);
  }

  selectFeature(index: number) {
    this.selectedFeature = this.features[index];
  }

  goToFeature(feature: any) {
    if (feature.externalLink) {
      window.open(feature.externalLink, '_blank');
    }

    if (feature.link) {
      this.router.navigateByUrl(feature.link);
    }
  }

}
