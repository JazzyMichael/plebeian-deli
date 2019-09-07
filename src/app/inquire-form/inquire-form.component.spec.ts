import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InquireFormComponent } from './inquire-form.component';

describe('InquireFormComponent', () => {
  let component: InquireFormComponent;
  let fixture: ComponentFixture<InquireFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InquireFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InquireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
