import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodesComponent } from './promo-codes.component';

describe('PromoCodesComponent', () => {
  let component: PromoCodesComponent;
  let fixture: ComponentFixture<PromoCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
