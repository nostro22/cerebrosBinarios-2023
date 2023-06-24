import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IniciarSesionPageRoutingModule } from './iniciar-sesion-routing.module';
import { IniciarSesionPage } from './iniciar-sesion.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IniciarSesionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [IniciarSesionPage, LoadingComponent]
})
export class IniciarSesionPageModule {}
