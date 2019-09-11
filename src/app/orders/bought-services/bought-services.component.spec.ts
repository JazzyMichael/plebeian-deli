import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoughtServicesComponent } from './bought-services.component';

describe('BoughtServicesComponent', () => {
  let component: BoughtServicesComponent;
  let fixture: ComponentFixture<BoughtServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoughtServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoughtServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
