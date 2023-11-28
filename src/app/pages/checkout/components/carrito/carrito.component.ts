import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/orden.interface';
import { ProductoOrden } from 'src/app/models/producto.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrdenService } from 'src/app/services/orden.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit {
  private user: string | null;
  orderId: number | undefined;
  productos: ProductoOrden[] = [];
  crossSellings: Producto[] = [];
  selectedProducto: Producto | null = null;
  addProductoForm: FormGroup = new FormGroup({});
  subtotal = 0;

  constructor(
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private productosService: ProductosService,
    private orderService: OrdenService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.user = authService.getUserId();

    this.addProductoForm = new FormGroup({
      cantidad: new FormControl(1, Validators.min(1)),
    });
  }

  ngOnInit(): void {
    if (this.authService.isUserAuthenticated() && this.user) {
      this.checkoutService.getOrden(this.user).subscribe({
        next: (value) => {
          console.log('value:', value);
          this.orderId = value;
          this.subtotal = 0;
          this.getProductosOrden(this.orderId!);
        },
        error: (err) => {
          console.log('error obteniendo orden de usuario', err);
        },
      });
    }
  }

  private getProductosOrden(orderId: number) {
    this.productosService.getProductosOrdenUsuario(orderId).subscribe({
      next: (value) => {
        this.productos = [...value];
        this.productos.map(
          (p) => (this.subtotal += p.producto.precio * p.cantidad),
        );
        this.orderService.setDatosCheckout({
          orderId: orderId,
          productos: this.productos,
          subTotal: this.subtotal,
        });

        this.getAllCrossSellings();
      },
      error: (err) => {
        console.log('error obteniendo productos de una orden : ', err);
      },
    });
  }

  getAllCrossSellings() {
    this.crossSellings = [];
    this.productos.forEach((p) => {
      this.productosService.getProducto(p.producto.id).subscribe({
        next: (product) => {
          product.crossSelling.forEach((cs) => {
            if (
              !this.crossSellings.find((x) => x.id === cs.id) &&
              !this.productos.find((x) => x.producto.id === cs.id)
            ) {
              this.crossSellings.push(cs);
            }
          });
        },
      });
    });
  }

  goCheckout() {
    console.log(this.orderId);
    this.router.navigate(['checkout'], {
      queryParams: { orderId: `${this.orderId}` },
      relativeTo: this.route,
    });
  }

  openCantidadDialog(producto: Producto) {
    this.selectedProducto = producto;
  }

  addProductoCarrito(productoId: number, formValue: any) {
    this.productosService
      .addProducto(productoId, formValue.cantidad)
      .subscribe({
        next: (_) => {
          console.log('Success');
          this.ngOnInit();
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

  removeProducto(productId: number) {
    this.productosService.removeProducto(productId, 0).subscribe({
      next: (_) => {
        console.log('Success');
        this.ngOnInit();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      },
    });
  }

  modifCantidadProducto(productOrder: ProductoOrden, event: any) {
    const newCantidad = Number(event.target.value);
    if (productOrder.cantidad == newCantidad || !newCantidad) return;
    else {
      productOrder.cantidad = newCantidad;
      productOrder.precio =
        productOrder.producto.precio * productOrder.cantidad;
      this.subtotal = 0;
      this.productos.map(
        (p) => (this.subtotal += p.producto.precio * p.cantidad),
      );
      this.productosService
        .modifCantidadProducto(productOrder.producto.id, newCantidad)
        .subscribe({
          next: (_) => {
            this.orderService.setDatosCheckout({
              orderId: this.orderId!,
              productos: this.productos,
              subTotal: this.subtotal,
            });
          },
        });
    }
  }
}
