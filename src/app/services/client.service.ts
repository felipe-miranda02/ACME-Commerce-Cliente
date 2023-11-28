import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Orden, PaginatedOrder } from '../models/orden.interface';
import { Cliente } from '../models/cliente.interface';
import { DireccionUsuarioDto } from '../models/user.interface';
import { AuthenticationService } from './authentication.service';

const CLIENT_PATH = `${environment.base_url}/Cliente`;

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(
    private http: HttpClient,
    private readonly authService: AuthenticationService,
  ) {}

  getCliente(): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${CLIENT_PATH}/${this.authService.getUserId()}`,
    );
  }

  editCliente(body: Cliente) {
    return this.http.patch(
      `${CLIENT_PATH}/${this.authService.getUserId()}`,
      body,
    );
  }

  agregarDireccion(userId: string, body: DireccionUsuarioDto) {
    return this.http.post(`${CLIENT_PATH}/${userId}/direcciones`, body);
  }

  getOrdenesUsuario(
    userId: string,
    fechaInicio: string,
    fechaFin: string,
    page: number,
    pageSize: number,
  ): Observable<PaginatedOrder> {
    let params = new HttpParams()
      .append('currentPage', page)
      .append('pageSize', pageSize)
      .append('inicio', fechaInicio)
      .append('fin', fechaFin);

    const options = { params };

    return this.http.get<PaginatedOrder>(
      `${CLIENT_PATH}/${userId}/ordenes`,
      options,
    );
  }

  calificarProducto(
    clienteId: string,
    productoId: number,
    titulo: string,
    descripcion: string,
    valoracion: number,
  ): Observable<any> {
    const body = {
      cliente_id: clienteId,
      titulo: titulo,
      descripcion: descripcion,
      valoracion: valoracion,
    };
    return this.http.post(
      `${CLIENT_PATH}/${clienteId}/producto/${productoId}/calificacion`,
      body,
    );
  }
}
