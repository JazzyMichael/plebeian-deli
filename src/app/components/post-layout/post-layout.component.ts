import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-layout',
  templateUrl: './post-layout.component.html',
  styleUrls: ['./post-layout.component.scss']
})
export class PostLayoutComponent implements OnInit {

  @Input() posts: any[];

  constructor() { }

  ngOnInit() {
  }

}
