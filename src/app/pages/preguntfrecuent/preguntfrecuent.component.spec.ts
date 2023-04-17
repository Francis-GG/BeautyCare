import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntfrecuentComponent } from './preguntfrecuent.component';

describe('PreguntfrecuentComponent', () => {
  let component: PreguntfrecuentComponent;
  let fixture: ComponentFixture<PreguntfrecuentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreguntfrecuentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntfrecuentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
