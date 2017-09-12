import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dride1Component } from './dride1.component';

describe('Dride1Component', () => {
  let component: Dride1Component;
  let fixture: ComponentFixture<Dride1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dride1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dride1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
