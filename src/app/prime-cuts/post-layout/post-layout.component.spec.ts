import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLayoutComponent } from './post-layout.component';

describe('PostLayoutComponent', () => {
  let component: PostLayoutComponent;
  let fixture: ComponentFixture<PostLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
