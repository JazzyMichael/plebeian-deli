import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameFormComponent } from './username-form.component';

describe('UsernameFormComponent', () => {
  let component: UsernameFormComponent;
  let fixture: ComponentFixture<UsernameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
