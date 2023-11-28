import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Orden } from 'src/app/models/orden.interface';
import { OrdenService } from 'src/app/services/orden.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-historial-orden-detail',
  templateUrl: './historial-orden-detail.component.html',
  styleUrls: ['./historial-orden-detail.component.scss'],
})
export class HistorialOrdenDetailComponent {
  public orden: Orden = {} as Orden;
  ordenId: number = 0;

  constructor(
    private route: ActivatedRoute,
    public ordenService: OrdenService,
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.ordenId = +params['id'];
    });

    this.ordenService.getOrden(this.ordenId).subscribe((orden) => {
      this.orden = orden;
    });
  }

  devolverProducto(id: number, producto_id: number) {
    this.ordenService.devolverProducto(id, producto_id).subscribe(
      () => {
        const empresaURI = this.authService.getEmpresaURI();
        this.router.navigate([`store/${empresaURI}/account/historial`]);
      },
      (error) => {
        console.log(error);
      },
    );
  }

  descargarImagen() {
    const imagenUrl =
      'https://borealtech.com/wp-content/uploads/2018/10/codigo-qr-1024x1024-1.jpg';

    const nombreArchivo = 'codigo-qr-1024x1024-1.jpg';

    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = imagenUrl;
    //enlaceDescarga.download = nombreArchivo;
    enlaceDescarga.target = '_blank';

    enlaceDescarga.click();
  }

  calificarProducto(producto_id: number) {
    const empresaURI = this.authService.getEmpresaURI();
    this.router.navigate([`store/${empresaURI}/producto/${producto_id}/calificar`]);
  }

  navigateProduct(productId: number) {
    const empresaURI = this.authService.getEmpresaURI();
    this.router.navigate([`store/${empresaURI}/producto/${productId}`]);
  }
}
