import { Injectable, NgModule } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastCtrl:ToastController) { 

  }

  async crearMensaje(mensaje: string, color:string){
    let toast = this.toastCtrl.create(
      {
        message:mensaje,
        duration:3000,
        position: 'top',
        color:color,
        icon:'alert-circle-outline'
      }
    );
    (await toast).present();
  }
}
