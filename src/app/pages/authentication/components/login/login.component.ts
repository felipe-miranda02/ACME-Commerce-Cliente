import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UserForAuthenticationDto,
  AuthResponseDto,
} from 'src/app/models/user.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private returnUrl: string = '';
  private empresaUri: string = '';

  loginForm: FormGroup = new FormGroup({});
  errorMessage: string = '';
  showError: boolean = false;
  empresaId: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.empresaId = authService.getEmpresaId();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    const empresaSession = sessionStorage.getItem('empresa');
    if (empresaSession) {
      this.empresaUri = JSON.parse(empresaSession).uri;
    }

    this.returnUrl = `store/${this.empresaUri}`;
  }

  validateControl = (controlName: string) => {
    return (
      this.loginForm.get(controlName)?.invalid &&
      this.loginForm.get(controlName)?.touched
    );
  };

  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)?.hasError(errorName);
  };

  loginUser = (loginFormValue: any) => {
    this.showError = false;
    const login = { ...loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.username,
      password: login.password,
      empresaId: this.empresaId,
    };
    this.authService.loginUser(userForAuth).subscribe({
      next: (res: AuthResponseDto) => {
        console.log('res login', res);
        this.authService.setToken({
          empresaId: this.empresaId,
          token: res.token,
        });
        localStorage.setItem('email', userForAuth.email);
        this.authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this.router.navigate([this.returnUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
