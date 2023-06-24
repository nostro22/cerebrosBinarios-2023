import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QrscannerService } from '../../servicios/qrscanner.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';


@Component({
  selector: 'app-pagar',
  templateUrl: './abonar.component.html',
  styleUrls: ['./abonar.component.scss'],
})
export class AbonarComponent implements OnInit {

  constructor(private vibration: Vibration,public scaner : QrscannerService, public mesasSrv : MesasService, private router:Router, private toastController: ToastController) { }
  @Input() pedido:any;
  @Output() pago?: EventEmitter<boolean> = new EventEmitter<boolean>();

  propina : number= 0;
  MostrarPropina=false
  MostrarPagar=true
  scanActivo=false;


  ngOnInit() {}
  async presentToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({message: mensaje,duration: 1500,color: color,});
    await toast.present();
  }

  agregarPropina()
  {
    this.MostrarPropina = true;
    this.MostrarPagar = false;
  }

  recibirPropina($event: any)
  {
    this.pedido = $event;
    this.MostrarPropina = false;
    this.MostrarPagar = true;
  }

  async Pagar()
  {
    this.mesasSrv.CambiarEstadoPedido(this.pedido, "pagado").then(()=>
    {
      this.presentToast(`Pago exitoso!`,'success');
      this.pago.emit(true);
    })
  }
  pararScan()
  {
    this.scanActivo=false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner()
  }
  async escanear() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
      if(result == "propina")
      {
        this.scanActivo = false;
        this.MostrarPagar = false;
        this.MostrarPropina = true;
      }
      else
      {
        this.presentToast(`QR incorrecto!`,'danger');
        this.vibration.vibrate(1000);
        this.scanActivo = false;
      }      
    }).catch((err)=>{console.log("Erorr: ", err.message)});
  }



  
 
}
