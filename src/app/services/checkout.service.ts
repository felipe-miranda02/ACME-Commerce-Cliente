import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CentroPickUp, ServicioEntrega } from '../models/empresa.interface';
import { RealizarPagoDto } from '../models/payment.interface';
import { DireccionUsuarioDto } from '../models/user.interface';

const CLIENT_PATH = `${environment.base_url}/Cliente`;
const EMPRESA_PATH = `${environment.base_url}/Empresa`;
const PAGO_PATH = `${environment.base_url}/Pago`;

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private http: HttpClient) {}

  // getCarritoId
  getOrden(userId: string) {
    const url = `${CLIENT_PATH}/${userId}/carrito`;

    let params = new HttpParams();
    return this.http.get<any>(url, { params });
  }

  getDireccionesUsuario(userId: string) {
    const url = `${CLIENT_PATH}/${userId}/direcciones`;

    let params = new HttpParams();
    return this.http.get<DireccionUsuarioDto[]>(url, { params });
  }

  getServiciosEntregaEmpresa(empresaId: string) {
    const url = `${EMPRESA_PATH}/${empresaId}/servicios-entrega`;

    return this.http.get<ServicioEntrega[]>(url);
  }

  getCentrosPickUp(empresaId: string) {
    const url = `${EMPRESA_PATH}/${empresaId}/pick-ups`;

    return this.http.get<CentroPickUp[]>(url);
  }

  // PAGO por Mercado Pago:
  realizarPago(body: RealizarPagoDto) {
    // const headers = new HttpHeaders().set('Content-Type', 'text/plain');

    return this.http.post(`${PAGO_PATH}`, body, {
      // headers,
      responseType: 'text',
    });
  }

  // Pago con Credito o Efectivo
  finalizarCompra(body: RealizarPagoDto) {
    return this.http.post(`${PAGO_PATH}/Finalizar`, body);
  }

  getPaymentMethods() {
    return [
      {
        id: 1,
        label: 'Credit card',
        method_value: 1,
      },
      {
        id: 2,
        label: 'Debit card',
        method_value: 1,
      },
      {
        id: 3,
        label: 'Efectivo',
        method_value: 0,
      },
      {
        id: 4,
        label: 'Mercado Pago',
        method_value: 2,
      },
    ];
  }
}
