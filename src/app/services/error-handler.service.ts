import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(() => new Error(errorMessage));
      }),
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.status === 404) {
      return this.handleNotFound(error);
    } else if (error.status === 400) {
      return this.handleBadRequest(error);
    } else if (error.status === 401) {
      return this.handleUnauthorized(error);
    } else {
      return undefined;
    }
  };

  private handleNotFound = (error: HttpErrorResponse): string => {
    this.router.navigate(['/404']);
    return error.message;
  };

  private handleBadRequest = (error: HttpErrorResponse): string => {
    if (
      this.router.url.includes('/auth/register') ||
      this.router.url.includes('/auth/resetpassword')
    ) {
      let message = '';
      const values = Object.values(error.error.errors);
      values.map((m: any) => {
        message += m + '<br>';
      });

      return message.slice(0, -4);
    } else {
      return error.error ? error.error : error.message;
    }
  };

  private handleUnauthorized = (error: HttpErrorResponse) => {
    if (this.router.url.includes('/auth/login')) {
      return 'Authentication failed. Wrong Username or Password';
    } else {
      const empresaURI = this.authService.getEmpresaURI();
      this.router.navigate([`store/${empresaURI}/auth/login`]);
      return error.message;
    }
  };
}
