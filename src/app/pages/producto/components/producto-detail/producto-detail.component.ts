import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto.interface';
import { ProductosService } from 'src/app/services/productos.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-producto-detail',
  templateUrl: './producto-detail.component.html',
  styleUrls: ['./producto-detail.component.scss'],
})
export class ProductoDetailComponent {
  public product: Producto = {} as Producto;
  productId: number = 0;
  public addProductoForm: FormGroup = new FormGroup({});
  public selectedProducto: Producto = {
    id: -1,
    titulo: '',
    descripcion: '',
    imagen: null,
    precio: -1,
    embalajeReciclable: false,
    productoReciclable: false,
    fabricacionResponsable: false,
    calificaciones: null,
    categoria: null,
    crossSelling: [],
    upSelling: [],
  };

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductosService,
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
    });

    this.productoService.getProducto(this.productId).subscribe((producto) => {
      this.product = producto;
    });

    this.router.url;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        location.reload();
      });

    this.addProductoForm = new FormGroup({
      cantidad: new FormControl(1, Validators.min(1)),
    });
  }

  public openCantidadDialog(producto: Producto) {
    this.selectedProducto = producto;
  }

  addProductoCarrito(productoId: number, formValue: any) {
    this.productoService.addProducto(productoId, formValue.cantidad).subscribe({
      next: (_) => {
        console.log('Success');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      },
    });
  }

  navigateProduct(productId: number) {
    const empresaURI = this.authService.getEmpresaURI();
    this.router.navigate([`store/${empresaURI}/producto/${productId}`]);
  }

  generateStarArray(quantity: number): number[] {
    return Array(quantity).fill(1);
  }
}
