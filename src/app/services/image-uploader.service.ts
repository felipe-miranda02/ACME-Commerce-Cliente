import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUploaderService {
  constructor(private http: HttpClient) {}

  public uploadImage(
    image: string,
    module: string = 'Cliente',
    id: string = 'f7270d0e-87bf-479e-aaca-98c46a82a623'
  ) {
    return this.http.patch(`${environment.base_url}/${module}/${id}`, {
      image: image,
    });
  }
}
