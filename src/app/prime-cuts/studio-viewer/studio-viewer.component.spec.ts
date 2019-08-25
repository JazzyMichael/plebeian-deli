import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioViewerComponent } from './studio-viewer.component';

describe('StudioViewerComponent', () => {
  let component: StudioViewerComponent;
  let fixture: ComponentFixture<StudioViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudioViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudioViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
