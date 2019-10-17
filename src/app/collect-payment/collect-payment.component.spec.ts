import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectPaymentComponent } from './collect-payment.component';

describe('CollectPaymentComponent', () => {
  let component: CollectPaymentComponent;
  let fixture: ComponentFixture<CollectPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
