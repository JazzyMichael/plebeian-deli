import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPostComponent } from './buy-post.component';

describe('BuyPostComponent', () => {
  let component: BuyPostComponent;
  let fixture: ComponentFixture<BuyPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
