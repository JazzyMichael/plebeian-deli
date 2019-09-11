import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePaymentComponent } from './service-payment.component';

describe('ServicePaymentComponent', () => {
  let component: ServicePaymentComponent;
  let fixture: ComponentFixture<ServicePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
