import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipBoundaryComponent } from './clip-boundary.component';

describe('ClipBoundaryComponent', () => {
  let component: ClipBoundaryComponent;
  let fixture: ComponentFixture<ClipBoundaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClipBoundaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipBoundaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
