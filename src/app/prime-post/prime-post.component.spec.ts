import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimePostComponent } from './prime-post.component';

describe('PrimePostComponent', () => {
  let component: PrimePostComponent;
  let fixture: ComponentFixture<PrimePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
