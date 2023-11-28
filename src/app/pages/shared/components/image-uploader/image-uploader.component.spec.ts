import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploaderComponent } from './ImageUploaderComponent';

describe('ImageUploaderComponent', () => {
  let component: ImageUploaderComponent;
  let fixture: ComponentFixture<ImageUploaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageUploaderComponent]
    });
    fixture = TestBed.createComponent(ImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
