import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldPostsComponent } from './sold-posts.component';

describe('SoldPostsComponent', () => {
  let component: SoldPostsComponent;
  let fixture: ComponentFixture<SoldPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
