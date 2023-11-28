import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { CanActivateChildFn } from '@angular/router';

import { EmpresaService } from '../services/empresa.service';

export const empresaDataGuard: CanActivateChildFn = (childRoute, state) => {
  const parentRoute = childRoute.parent;
  if (parentRoute && parentRoute.paramMap.get('uri') != null) {
    const uri = parentRoute.paramMap.get('uri') ?? '';
    const sessionStorageValue = sessionStorage.getItem('empresa');
    const empresaData =  sessionStorageValue ? JSON.parse(sessionStorageValue) : null;
  
    if (empresaData == null || empresaData.id == -1|| empresaData.uri != uri) {
      return inject(EmpresaService)
        .getEmpresaFromUri(uri)
        .pipe(
          map((empresa) => {
            sessionStorage.setItem('empresa', JSON.stringify(empresa));
            return true;
          }),
          catchError(() => {
            return of(false);
          })
        );
    } else {
      return of(true);
    }
  } else {
    return true;
  }
};
