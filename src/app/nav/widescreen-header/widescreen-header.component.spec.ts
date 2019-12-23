import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidescreenHeaderComponent } from './widescreen-header.component';

describe('WidescreenHeaderComponent', () => {
  let component: WidescreenHeaderComponent;
  let fixture: ComponentFixture<WidescreenHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidescreenHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidescreenHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
