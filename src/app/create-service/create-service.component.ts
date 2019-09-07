import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {

  @Input() service: any;
  @Input() approvedSeller: boolean;

  @Output() save: EventEmitter<any> = new EventEmitter();

  title: string;
  description: string;

  constructor() { }

  ngOnInit() {
    if (this.service) {
      this.title = this.service.title;
      this.description = this.service.description;
    }
  }

  saveService() {
    const serviceObj = {
      title: this.title,
      description: this.description,
      createdTimestamp: new Date()
    };

    this.save.emit(serviceObj);
  }

}
