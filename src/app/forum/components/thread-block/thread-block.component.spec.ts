import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadBlockComponent } from './thread-block.component';

describe('ThreadBlockComponent', () => {
  let component: ThreadBlockComponent;
  let fixture: ComponentFixture<ThreadBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
