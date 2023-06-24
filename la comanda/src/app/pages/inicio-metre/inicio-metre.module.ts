import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicioMetrePageRoutingModule } from './inicio-metre-routing.module';
import { InicioMetrePage } from './inicio-metre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioMetrePageRoutingModule
  ],
  declarations: [InicioMetrePage]
})
export class InicioMetrePageModule {}
