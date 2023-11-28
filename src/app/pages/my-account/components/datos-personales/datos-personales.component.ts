import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  email!: string | null;
  userId: string = '';
  client!: Cliente;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
  ) {}

  ngOnInit() {
    this.email = this.authService.getEmail();
    this.userId = this.authService.getUserId();
    this.userForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
    });
    this.getUserData();
  }

  getUserData() {
    this.clientService.getCliente().subscribe({
      next: (cliente) => {
        this.client = cliente;
        this.userForm.get('nombre')?.patchValue(this.client.nombre);
        this.userForm.get('apellido')?.patchValue(this.client.apellido);
      },
    });
  }

  editUser(userForm: any) {
    const data = { ...userForm };
    const body: Cliente = {
      nombre: data.nombre,
      apellido: data.apellido,
      image: this.client.image,
    };
    this.clientService.editCliente(body).subscribe({
      next: (_) => {
        console.log('Success');
        this.ngOnInit();
      },
      error: (err) => {
        console.log('error al actualizar usuario : ', err.message);
      },
    });
  }

  logout() {
    this.authService.logOut();
    const empresaURI = this.authService.getEmpresaURI();
    this.router.navigate([`store/${empresaURI}/producto`]);
  }
}
