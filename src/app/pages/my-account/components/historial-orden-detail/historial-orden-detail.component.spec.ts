import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialOrdenDetailComponent } from './historial-orden-detail.component';

describe('HistorialOrdenDetailComponent', () => {
  let component: HistorialOrdenDetailComponent;
  let fixture: ComponentFixture<HistorialOrdenDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialOrdenDetailComponent]
    });
    fixture = TestBed.createComponent(HistorialOrdenDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
