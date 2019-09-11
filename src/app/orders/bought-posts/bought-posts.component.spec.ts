import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoughtPostsComponent } from './bought-posts.component';

describe('BoughtPostsComponent', () => {
  let component: BoughtPostsComponent;
  let fixture: ComponentFixture<BoughtPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoughtPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoughtPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
