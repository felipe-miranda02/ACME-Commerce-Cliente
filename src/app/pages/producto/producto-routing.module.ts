import { NgModule, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { ProductoDetailComponent } from './components/producto-detail/producto-detail.component';
import { ProductosService } from 'src/app/services/productos.service';
import { CalificarProductoComponent } from './components/calificar-producto/calificar-producto.component';

const routes: Routes = [
  {
    path: '',
    component: ProductoListComponent,
    resolve: { 
      paginatedProduct: () => inject(ProductosService).getProductos(),
      categorias: () => inject(ProductosService).getCategorias(),
    },
  },
  {
    path: ':id',
    component: ProductoDetailComponent,
  },
  {
    path: ':id/calificar',
    component: CalificarProductoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
