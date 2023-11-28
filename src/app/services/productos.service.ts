import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Categoria,
  PaginatedProducts,
  Producto,
  ProductoOrden,
} from 'src/app/models/producto.interface';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

const ORDER_PATH = `${environment.base_url}/Orden`;
const PRODUCTO_PATH = `${environment.base_url}/Producto`;

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) {}

  getProductosOrdenUsuario(orderId: number): Observable<ProductoOrden[]> {
    return this.http.get<ProductoOrden[]>(`${ORDER_PATH}/${orderId}/productos`);
  }

  getProductos(
    page: number = 1,
    searchText: string = '',
    categoriaId: number = -1,
  ): Observable<PaginatedProducts> {
    let params = new HttpParams()
      .append('currentPage', page)
      .append('pageSize', environment.pageSize)
      .append('categoriaId', categoriaId);

    if (searchText != '') {
      params = params.append('searchText', searchText);
    }
    const options = { params };
    const empresa = sessionStorage.getItem('empresa') ?? '';

    return this.http.get<PaginatedProducts>(
      `${PRODUCTO_PATH}/empresa/${JSON.parse(empresa).id}`,
      options,
    );
  }

  getCategorias(): Observable<Categoria[]> {
    const empresa = sessionStorage.getItem('empresa') ?? '';

    return this.http.get<Categoria[]>(
      `${environment.base_url}/Empresa/${JSON.parse(empresa).id}/categorias`,
    );
  }

  addProducto(productoId: number, cantidad: number) {
    return this.http.post(
      `${
        environment.base_url
      }/Cliente/${this.authService.getUserId()}/Producto`,
      {
        productoId: productoId,
        cantidad: cantidad,
      },
    );
  }

  removeProducto(productoId: number, cantidad: number) {
    return this.http.delete(
      `${
        environment.base_url
      }/Cliente/${this.authService.getUserId()}/Producto`,
      {
        body: {
          productoId: productoId,
          cantidad: cantidad,
        },
      },
    );
  }

  modifCantidadProducto(productoId: number, cantidad: number) {
    return this.http.patch(
      `${
        environment.base_url
      }/Cliente/${this.authService.getUserId()}/Producto`,
      {
        productoId: productoId,
        cantidad: cantidad,
      },
    );
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${environment.base_url}/Producto/${id}`);
  }
}
