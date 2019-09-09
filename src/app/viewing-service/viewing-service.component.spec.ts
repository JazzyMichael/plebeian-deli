import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewingServiceComponent } from './viewing-service.component';

describe('ViewingServiceComponent', () => {
  let component: ViewingServiceComponent;
  let fixture: ComponentFixture<ViewingServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewingServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
