import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncuestaSupervisorPageRoutingModule } from './encuesta-supervisor-routing.module';

import { EncuestaSupervisorPage } from './encuesta-supervisor.page';
import { LoadingComponent } from 'src/app/componentes/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncuestaSupervisorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EncuestaSupervisorPage, LoadingComponent]
})
export class EncuestaSupervisorPageModule {}
