import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeCutsComponent } from './prime-cuts.component';

describe('PrimeCutsComponent', () => {
  let component: PrimeCutsComponent;
  let fixture: ComponentFixture<PrimeCutsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimeCutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeCutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
