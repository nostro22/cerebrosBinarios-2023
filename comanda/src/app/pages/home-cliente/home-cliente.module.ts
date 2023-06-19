import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, LoadingController } from '@ionic/angular';

import { HomeClientePageRoutingModule } from './home-cliente-routing.module';

import { HomeClientePage } from './home-cliente.page';
import { ChartsEncuestaClientesPage } from '../charts-encuesta-clientes/charts-encuesta-clientes.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeClientePageRoutingModule,
    
  ],
  declarations: [HomeClientePage,ChartsEncuestaClientesPage, LoadingComponent]
})
export class HomeClientePageModule {}
