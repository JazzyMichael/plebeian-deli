import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldServicesComponent } from './sold-services.component';

describe('SoldServicesComponent', () => {
  let component: SoldServicesComponent;
  let fixture: ComponentFixture<SoldServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
