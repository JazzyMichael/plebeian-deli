import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPrimePostComponent } from './new-prime-post.component';

describe('NewPrimePostComponent', () => {
  let component: NewPrimePostComponent;
  let fixture: ComponentFixture<NewPrimePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPrimePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPrimePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
