import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductRoutingModule } from './producto-routing.module';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { ProductoDetailComponent } from './components/producto-detail/producto-detail.component';
import { CoreModule } from '../core/core.module';
import { CalificarProductoComponent } from './components/calificar-producto/calificar-producto.component';

@NgModule({
  declarations: [
    ProductoListComponent,
    ProductoDetailComponent,
    CalificarProductoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ProductoModule { }
