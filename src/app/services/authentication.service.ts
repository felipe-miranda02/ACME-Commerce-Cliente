import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import {
  AuthResponseDto,
  ForgotPasswordDto,
  RegistrationResponseDto,
  ResetPasswordDto,
  UserForAuthenticationDto,
  UserForRegistrationDto,
} from '../models/user.interface';
import { environment } from 'src/environments/environment';

export interface Token {
  empresaId: string;
  token: string;
}

const AUTH_PATH = `${environment.base_url}/accounts`;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
  ) {}

  public registerUser(body: UserForRegistrationDto) {
    return this.http.post<RegistrationResponseDto>(
      `${AUTH_PATH}/Registration`,
      body,
    );
  }

  public loginUser(body: UserForAuthenticationDto) {
    return this.http.post<AuthResponseDto>(`${AUTH_PATH}/Login/Cliente`, body);
  }

  public forgotPassword(body: ForgotPasswordDto) {
    return this.http.post(`${AUTH_PATH}/ForgotPassword`, body);
  }

  public resetPassword(body: ResetPasswordDto) {
    return this.http.post(`${AUTH_PATH}/ResetPassword`, body);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
  };

  public isUserAuthenticated = (): boolean => {
    const empresaId: string = this.getEmpresaId();
    const token = localStorage.getItem(`TOKEN_EMPRESA_${empresaId}`);

    return !!(token && !this.jwtHelper.isTokenExpired(token));
  };

  public logOut() {
    const empresaId: string = this.getEmpresaId();
    localStorage.removeItem(`TOKEN_EMPRESA_${empresaId}`);
    localStorage.removeItem('email');
    this.sendAuthStateChangeNotification(false);
  }

  public getEmail() {
    return localStorage.getItem('email');
  }

  public getUserId() {
    const data = this.jwtHelper.decodeToken();
    return data.id;
  }

  public getEmpresaId() {
    return JSON.parse(sessionStorage.getItem('empresa')!).id;
  }

  public getEmpresaURI() {
    return JSON.parse(sessionStorage.getItem('empresa')!).uri;
  }

  public getToken(empresaId: string) {
    return localStorage.getItem(`TOKEN_EMPRESA_${empresaId}`);
  }

  public setToken(token: Token) {
    localStorage.setItem(`TOKEN_EMPRESA_${token.empresaId}`, token.token);
  }
}
