// REGISTER
export interface UserForRegistrationDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  empresaId: string;
}

export interface RegistrationResponseDto {
  isSuccessfulRegistration: boolean;
  errros: string[];
}

// LOGIN
export interface UserForAuthenticationDto {
  email: string;
  password: string;
  empresaId: string;
}

export interface AuthResponseDto {
  isAuthSuccessful: boolean;
  errorMessage: string;
  token: string;
  id?: string;
  name?: string;
  email: string;
}

// FORGOT PASSWORD
export interface ForgotPasswordDto {
  email: string;
  clientURI: string;
  empresaId: string;
}

// RESET PASSWORD
export interface ResetPasswordDto {
  password: string;
  confirmPassword: string;
  email: string;
  token: string;
  empresaId: string;
}

// DIRECCIONES DE USUARIO
export interface DireccionUsuarioDto {
  id?: number;
  nombre: string;
  direccionFormateada: string;
  latitud: number;
  longitud: number;
}
