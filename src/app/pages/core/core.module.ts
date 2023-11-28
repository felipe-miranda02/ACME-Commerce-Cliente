import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { StoreHomeComponent } from './components/store-home/store-home.component';



@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    StoreHomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  exports: [
    HeaderComponent,
    HomeComponent,
  ]
})
export class CoreModule { }
