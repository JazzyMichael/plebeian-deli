import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FYouComponent } from './f-you.component';

describe('FYouComponent', () => {
  let component: FYouComponent;
  let fixture: ComponentFixture<FYouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
