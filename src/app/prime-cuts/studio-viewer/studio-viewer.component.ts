import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-studio-viewer',
  templateUrl: './studio-viewer.component.html',
  styleUrls: ['./studio-viewer.component.scss']
})
export class StudioViewerComponent implements OnInit {
  @Input() studio: any;
  @Output() viewAll: EventEmitter<any> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  getVideoUrl() {
    const url = this.studio.videoUrl;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  viewAllClick() {
    this.viewAll.emit(true);
  }

  viewPostClick() {
    this.viewAll.emit(true);
  }

}
