import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {
  DireccionDeEntrega,
  Orden,
  Producto,
  ServicioDeEntrega,
} from '../models/orden.interface';
import { ProductoOrden } from '../models/producto.interface';

const ORDEN_PATH = `${environment.base_url}/Orden`;

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private datosCheckout?: {
    orderId: number;
    subTotal: number;
    productos: ProductoOrden[];
  };
  constructor(private http: HttpClient) {}

  getOrden(ordenId: number): Observable<Orden> {
    return this.http.get<Orden>(`${ORDEN_PATH}/${ordenId}`);
  }

  devolverProducto(id: number, producto_id: number): Observable<any> {
    return this.http.delete(`${ORDEN_PATH}/${id}/productos/${producto_id}`);
  }

  obtenerFecha(fecha: string): string {
    if (fecha == null) {
      return '-';
    } else {
      return this.formatearFecha(fecha);
    }
  }

  formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    const fechaFormateada = `${dia}/${mes}/${año}`;

    return fechaFormateada;
  }

  obtenerServicioEntrega(servicio?: ServicioDeEntrega): string {
    if (servicio) {
      return servicio.nombre + ' (' + servicio.velocidad + ')';
    }
    return '-';
  }

  obtenerDireccion(direccion: DireccionDeEntrega): string {
    if (direccion) {
      return direccion.nombre;
    }
    return '-';
  }

  obtenerMetodoPago(metodo: number) {
    if (metodo == 1) {
      return 'Tarjeta';
    } else if (metodo == 0) {
      return 'Efectivo';
    } else {
      return '-';
    }
  }

  obtenerEstadoPedido(estado: number) {
    switch (estado) {
      case 0:
        return 'Carrito';
      case 1:
        return 'Creada';
      case 2:
        return 'Empacado';
      case 3:
        return 'En Centro de Envíos';
      case 4:
        return 'En Tránsito';
      case 5:
        return 'Recibido';
      default:
        return 'Error';
    }
  }

  getDatosCheckout() {
    this.datosCheckout = JSON.parse(sessionStorage.getItem('datosCheckout')!);
    return this.datosCheckout;
  }

  setDatosCheckout(
    datosCheckout:
      | { orderId: number; subTotal: number; productos: ProductoOrden[] }
      | undefined,
  ) {
    this.datosCheckout = datosCheckout;
    sessionStorage.setItem('datosCheckout', JSON.stringify(this.datosCheckout));
  }
}
