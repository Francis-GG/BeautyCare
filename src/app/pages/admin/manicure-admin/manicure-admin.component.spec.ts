import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManicureAdminComponent } from './manicure-admin.component';

describe('ManicureAdminComponent', () => {
  let component: ManicureAdminComponent;
  let fixture: ComponentFixture<ManicureAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManicureAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManicureAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
