import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { EmpresaDto } from '../models/empresa.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  constructor(
    private http: HttpClient,
  ) { }

  getEmpresaFromUri(uri: string): Observable<EmpresaDto> {
    return this.http.get<EmpresaDto>(
      `${environment.base_url}/empresa/store/${uri}`
    );
  }

  getEmpresas(): Observable<EmpresaDto> {
    return this.http.get<EmpresaDto>(
      `${environment.base_url}/empresa`
    )
  }

}
