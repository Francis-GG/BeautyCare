import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepilacionComponent } from './depilacion.component';

describe('DepilacionComponent', () => {
  let component: DepilacionComponent;
  let fixture: ComponentFixture<DepilacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepilacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepilacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
