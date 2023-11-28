import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Categoria, Producto } from 'src/app/models/producto.interface';
import { ProductosService } from 'src/app/services/productos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss'],
})
export class ProductoListComponent {
  public addProductoForm: FormGroup = new FormGroup({});
  public productos: Producto[] = [];
  public categorias: Categoria[] = [];
  public currentPage: number = 1;
  public pageSize: number = environment.pageSize;
  public pageCount: number = 1;
  public categoriaId: number = -1;
  public filter: string = '';
  public pageNumberArray: number[] = [];
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
    private acitvatedRoute: ActivatedRoute,
    private productoService: ProductosService,
  ) {}

  ngOnInit() {
    this.acitvatedRoute.data.subscribe(({ paginatedProduct, categorias }) =>
      this.loadProducts(paginatedProduct, categorias),
    );

    this.acitvatedRoute.queryParams.subscribe((params) => {
      if (params['filter'] !== undefined) {
        const filter = params['filter'];
        this.callGetProductos(1, filter, -1);
      }
    });

    this.addProductoForm = new FormGroup({
      cantidad: new FormControl(1, Validators.min(1)),
    });
  }

  public loadProducts(paginatedProduct: any, categorias: any) {
    this.productos = paginatedProduct.productos;
    this.currentPage = paginatedProduct.currentPage;
    this.pageSize = paginatedProduct.pageSize;
    this.pageCount = paginatedProduct.pageCount;
    this.categorias = categorias;
    this.filter = paginatedProduct.searchText;

    this.pageNumberArray = Array(this.pageCount)
      .fill(null)
      .map((x, i) => i + 1);
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

  callGetProductos(pageNumber: number, filter: string, categoriaId: number) {
    if (categoriaId != null)
      this.productoService
        .getProductos(pageNumber, filter, categoriaId)
        .subscribe((product) => {
          (this.productos = product.productos),
            (this.currentPage = product.currentPage);
          this.pageSize = product.pageSize;
          this.pageCount = product.pageCount;
          this.filter = product.searchText ? product.searchText : '';
          this.categoriaId = product.categoriaId ? product.categoriaId : -1;

          this.pageNumberArray = Array(this.pageCount)
            .fill(null)
            .map((x, i) => i + 1);
        });
  }

  removeCategory() {
    this.categoriaId = -1;
    this.callGetProductos(1, '', -1);
  }
}
