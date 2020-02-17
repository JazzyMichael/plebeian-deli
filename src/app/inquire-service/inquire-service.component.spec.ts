import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InquireServiceComponent } from './inquire-service.component';

describe('InquireServiceComponent', () => {
  let component: InquireServiceComponent;
  let fixture: ComponentFixture<InquireServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InquireServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquireServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
