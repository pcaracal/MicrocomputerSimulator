import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPUComponent } from './cpu.component';

describe('CPUComponent', () => {
  let component: CPUComponent;
  let fixture: ComponentFixture<CPUComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CPUComponent]
    });
    fixture = TestBed.createComponent(CPUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
