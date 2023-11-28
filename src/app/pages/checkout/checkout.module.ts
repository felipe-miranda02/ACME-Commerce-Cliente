import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { CarritoComponent } from './components/carrito/carrito.component';

@NgModule({
  declarations: [
    CarritoComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CheckoutRoutingModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [],
})
export class CheckoutModule {}
