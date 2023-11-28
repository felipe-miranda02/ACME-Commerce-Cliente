import { NgModule, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { HomeComponent } from './pages/core/components/home/home.component';
import { StoreHomeComponent } from './pages/core/components/store-home/store-home.component';
import { EmpresaService } from './services/empresa.service';
import { empresaDataGuard } from './guards/empresa-data.guard';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { map, pluck } from 'rxjs';

const routes: Routes = [
  {
    component: HomeComponent,
    path: '',
    pathMatch: 'full',
    title: 'ACME E-commerce',
  },
  {
    component: StoreHomeComponent,
    path: 'store/:uri',
    resolve: {
      empresa: (route: ActivatedRouteSnapshot) => {
        const uri = route.params['uri'];

        return inject(EmpresaService).getEmpresaFromUri(uri);
      },
    },
    title: (route: ActivatedRouteSnapshot) => {
      const uri = route.params['uri'];
      return inject(EmpresaService)
        .getEmpresaFromUri(uri)
        .pipe(map((x) => x.nombre));
    },
    canActivateChild: [empresaDataGuard],
    children: [
      {
        path: 'producto',
        loadChildren: () =>
          import('./pages/producto/producto.module').then(
            (m) => m.ProductoModule,
          ),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./pages/checkout/checkout.module').then(
            (m) => m.CheckoutModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./pages/my-account/my-account.module').then(
            (m) => m.MyAccountModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const heroResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(AuthenticationService).getEmpresaURI();
};
