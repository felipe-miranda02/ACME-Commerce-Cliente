import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserForRegistrationDto } from 'src/app/models/user.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PasswordConfirmationValidatorService } from '../../validators/paswword-validator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  public errorMessage: string = '';
  public showError: boolean = false;
  private empresaId: string;

  constructor(
    private authService: AuthenticationService,
    private passwordValidator: PasswordConfirmationValidatorService,
    private router: Router,
  ) {
    this.empresaId = authService.getEmpresaId();

    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl(''),
    });

    this.registerForm
      .get('confirm')!
      .setValidators([
        Validators.required,
        this.passwordValidator.validateConfirmPassword(
          this.registerForm.get('password')!,
        ),
      ]);
  }
  ngOnInit(): void {}

  public validateControl = (controlName: string) => {
    return (
      this.registerForm.get(controlName)?.invalid &&
      this.registerForm.get(controlName)?.touched
    );
  };

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName)?.hasError(errorName);
  };

  public registerUser = (registerFormValue: any) => {
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      nombre: formValues.firstName,
      apellido: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
      empresaId: this.empresaId,
    };
    this.authService.registerUser(user).subscribe({
      next: (_) => {
        console.log('Successful registration');
        const empresaURI = this.authService.getEmpresaURI();
        this.router.navigate([`store/${empresaURI}/auth/login`]);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      },
    });
  };
}
