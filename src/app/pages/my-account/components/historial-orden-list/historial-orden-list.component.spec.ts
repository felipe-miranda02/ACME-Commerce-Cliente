import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialOrdenListComponent } from './historial-orden-list.component';

describe('HistorialOrdenListComponent', () => {
  let component: HistorialOrdenListComponent;
  let fixture: ComponentFixture<HistorialOrdenListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialOrdenListComponent]
    });
    fixture = TestBed.createComponent(HistorialOrdenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
