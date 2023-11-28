import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { HistorialOrdenListComponent } from './components/historial-orden-list/historial-orden-list.component';
import { HistorialOrdenDetailComponent } from './components/historial-orden-detail/historial-orden-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    children: [
      {
        component: DatosPersonalesComponent,
        path: 'data',
      },
      {
        component: DireccionesComponent,
        path: 'direcciones',
      },
      {
        component: OrdenesComponent,
        path: 'ordenes',
      },
      {
        component: CambiarPasswordComponent,
        path: 'change-password',
      },
      {
        component: HistorialOrdenListComponent,
        path: 'historial',
      },
      {
        component: HistorialOrdenDetailComponent,
        path: 'historial/:id',
      },
      {
        path: '',
        redirectTo: '/data',
        pathMatch: 'full',
      },
    ],
    resolve: {
      cliente: () => inject(ClientService).getCliente(),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAccountRoutingModule {}
