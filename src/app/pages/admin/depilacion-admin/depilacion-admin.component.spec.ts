import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepilacionAdminComponent } from './depilacion-admin.component';

describe('DepilacionAdminComponent', () => {
  let component: DepilacionAdminComponent;
  let fixture: ComponentFixture<DepilacionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepilacionAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepilacionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
