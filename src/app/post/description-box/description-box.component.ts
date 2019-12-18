import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-description-box',
  templateUrl: './description-box.component.html',
  styleUrls: ['./description-box.component.scss']
})
export class DescriptionBoxComponent implements OnInit {

  @Input() description: string;

  constructor() { }

  ngOnInit() {
  }

}
