import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceActivityComponent } from './service-activity.component';

describe('ServiceActivityComponent', () => {
  let component: ServiceActivityComponent;
  let fixture: ComponentFixture<ServiceActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
