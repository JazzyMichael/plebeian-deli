import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-activity',
  templateUrl: './post-activity.component.html',
  styleUrls: ['./post-activity.component.scss']
})
export class PostActivityComponent implements OnInit {
  @Input() order: any;

  ratings: number[] = [1, 2, 3, 4, 5];
  rating: number;
  rated: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
