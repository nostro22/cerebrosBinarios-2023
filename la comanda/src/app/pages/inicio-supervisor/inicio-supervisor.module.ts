import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicioSupervisorPageRoutingModule } from './inicio-supervisor-routing.module';
import { InicioSupervisorPage } from './inicio-supervisor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioSupervisorPageRoutingModule
  ],
  declarations: [InicioSupervisorPage]
})
export class InicioSupervisorPageModule {}
