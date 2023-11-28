import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-calificar-producto',
  templateUrl: './calificar-producto.component.html',
  styleUrls: ['./calificar-producto.component.scss'],
})
export class CalificarProductoComponent {
  constructor(
    private clienteService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.clienteId = authService.getUserId();
  }

  clienteId: string;
  productoId: number = 0;
  titulo: string = '';
  descripcion: string = '';
  valoracion: number = 1;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productoId = +params['id'];
    });
  }

  calificarProducto() {
    this.clienteService
      .calificarProducto(
        this.clienteId,
        this.productoId,
        this.titulo,
        this.descripcion,
        this.valoracion,
      )
      .subscribe(
        (response) => {
          const empresaURI = this.authService.getEmpresaURI();
          this.router.navigate([`store/${empresaURI}/account/historial`]);
          console.log('Calificación exitosa', response);
        },
        (error) => {
          console.error('Error al calificar el producto', error);
        },
      );
  }
}
