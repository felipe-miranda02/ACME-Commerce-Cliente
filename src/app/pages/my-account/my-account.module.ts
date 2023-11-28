import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { DatosPersonalesComponent } from './components/datos-personales/datos-personales.component';
import { OrdenesComponent } from './components/ordenes/ordenes.component';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ImageUploaderModule } from 'src/app/pages/shared/components/image-uploader/image-uploader.module';
import { HistorialOrdenDetailComponent } from './components/historial-orden-detail/historial-orden-detail.component';
import { HistorialOrdenListComponent } from './components/historial-orden-list/historial-orden-list.component';

@NgModule({
  declarations: [
    MyAccountComponent,
    DatosPersonalesComponent,
    OrdenesComponent,
    CambiarPasswordComponent,
    DireccionesComponent,
    HistorialOrdenListComponent,
    HistorialOrdenDetailComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MyAccountRoutingModule,
    GoogleMapsModule,
    ImageUploaderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class MyAccountModule {}
