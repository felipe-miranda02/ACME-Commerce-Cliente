import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ImageUploaderService } from 'src/app/services/image-uploader.service';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent {

  public imageSrc: string = '';

  constructor(private imageUploaderService: ImageUploaderService) {}

  public onImageUploaded(event: any) {
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const reader = new FileReader();

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private _handleReaderLoaded(event: any) {
    let reader = event.target;
    this.imageSrc = reader.result;
    this.imageUploaderService.uploadImage(reader.result).subscribe({
      next: (_) => {
        console.log('Success');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    });
  }

}
