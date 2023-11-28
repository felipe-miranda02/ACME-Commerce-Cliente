import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  DireccionDeEntrega,
  Orden,
  ServicioDeEntrega,
} from 'src/app/models/orden.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClientService } from 'src/app/services/client.service';
import { OrdenService } from 'src/app/services/orden.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-historial-orden-list',
  templateUrl: './historial-orden-list.component.html',
  styleUrls: ['./historial-orden-list.component.scss'],
})
export class HistorialOrdenListComponent {
  public ordenes: Orden[] = [];
  private user: string;
  searchForm: FormGroup;
  public currentPage: number = 1;
  public pageSize: number = environment.pageSize;
  public pageCount: number = 1;
  public pageNumberArray: number[] = [];
  public fechaInicio = '2022-01-01';
  public fechaFin = '2024-01-01';

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private clienteService: ClientService,
    public ordenService: OrdenService,
    private authService: AuthenticationService,
  ) {
    this.user = authService.getUserId();
    this.searchForm = new FormGroup({
      fechaInicio: new FormControl('2022-01-01', Validators.required),
      fechaFin: new FormControl('2024-01-01', Validators.required),
    });
  }

  ngOnInit() {
    if (this.authService.isUserAuthenticated() && this.user) {
      this.user = this.authService.getUserId();

      this.pageNumberArray = Array(this.pageCount)
        .fill(null)
        .map((x, i) => i + 1);

      this.clienteService
        .getOrdenesUsuario(
          this.user,
          this.fechaInicio,
          this.fechaFin,
          this.currentPage,
          this.pageSize,
        )
        .subscribe((res) => {
          this.ordenes = res.ordenes;
          this.currentPage = res.currentPage;
          this.pageSize = res.pageSize;
          this.pageCount = res.pageCount;
          this.pageNumberArray = Array(this.pageCount)
            .fill(null)
            .map((x, i) => i + 1);
        });
    }
  }

  aplicarFiltros() {
    this.fechaInicio = this.searchForm.get('fechaInicio')?.value;
    this.fechaFin = this.searchForm.get('fechaFin')?.value;
    this.callGetOrdenes(1);
  }

  callGetOrdenes(pageNumber: number) {
    this.currentPage = pageNumber;
    this.clienteService
      .getOrdenesUsuario(
        this.user,
        this.fechaInicio,
        this.fechaFin,
        pageNumber,
        this.pageSize,
      )
      .subscribe((res) => {
        this.ordenes = res.ordenes;
        this.currentPage = res.currentPage;
        this.pageSize = res.pageSize;
        this.pageCount = res.pageCount;
        console.log(res);
        this.pageNumberArray = Array(this.pageCount)
          .fill(null)
          .map((x, i) => i + 1);
      });
  }
}
