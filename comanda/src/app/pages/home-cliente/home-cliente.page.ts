import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { PushService } from 'src/app/servicios/push.service';
import { QrscannerService } from 'src/app/servicios/qrscanner.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {

  scanActivo: boolean = false;
  scanCoincide: boolean = false;
  contenido: any;
  spinner: boolean = false;
  verEncuestas: boolean = false;
  mostrarMenu: boolean = false;
  numeroMesaQR: number = null;
  estaEnLaLista: boolean = false;
  ingreso: boolean = false;
  clienteEncontrado: any = null;
  tokenMetres: string[] = [];
  numeroMesa: number = 0;
  escanerMesaOk: boolean = false;

  constructor(public scaner: QrscannerService, private toastController: ToastController,
    private firestoreService: FirestoreService, public auth: AuthService, private mesasService: MesasService,
    public afs: AngularFirestore, private pushService: PushService,
    private router: Router, private vibration: Vibration) {
    this.scaner.scanPrepare();
  }

  async ngOnInit() {
    this.mesasService.traerListaEspera()
      .subscribe(async (listadoEncuestasClientes) => {
        await listadoEncuestasClientes.forEach(async (cliente: any) => {
          if (cliente.uid == this.auth.UsuarioActivo.uid) {//si esta en la lista y tiene mesa asignada
            if (cliente.mesaAsignada != null) {
              this.numeroMesa = cliente.mesaAsignada;
              console.log(cliente.email);
              this.presentToast('Se le asigno la mesa ' + this.numeroMesa + '!', 'success', 'thumbs-up-outline');
              this.estaEnLaLista = true;
            }
          } else {
            this.estaEnLaLista = false;
          }
        });
      });
    this.firestoreService.traerMetres().subscribe((metres: any) => {
      this.tokenMetres = [];
      console.log('METRES', metres);
      metres.forEach((metre) => {
        if (metre.token != '') {
          this.tokenMetres.push(metre.token);
        }
      });
      console.log('TOKENS', this.tokenMetres);
    });
  }
  async escanearDocumento() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    this.scaner.startScan().then((result) => {
      this.contenido = result;
      if (result == "qrlocal") {
        this.scanActivo = false;
        this.scanCoincide = true;
        this.mostrarMenu = true;
      }
      else {
        this.presentToast('El código QR escaneado no pertenece al local!', 'danger', 'qr-code-outline');
        this.scanActivo = false;
        this.vibration.vibrate(1000);
      }


    }).catch((error) => {
      console.log('ERROR ESCANER HOME-CLIENTE: ', error);
      this.vibration.vibrate(1000);
    })
  }
  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color
    });

    await toast.present();
  }

  async entrarListaEspera() {
    this.spinner = true;
    if (!this.estaEnLaLista) {
      await this.firestoreService.agregarAListaDeEspera(this.auth.UsuarioActivo).catch(() => {
        this.presentToast('Ocurrió un error al ingresar a la lista de espera.', 'danger', 'alert-circle-outline');
        this.vibration.vibrate(1000);
      }).then(() => {
        this.enviarPushAMetre();
        this.presentToast('Ingreso en la lista de espera!', 'success', 'thumbs-up-outline');
      });
      this.spinner = false;

    } else {
      this.presentToast('Ya esta en la lista de espera', 'warning', 'alert-circle-outline');
      this.vibration.vibrate(1000);
    }

    this.spinner = false;
  }

  pararScan() {
    this.scanActivo = false;
    document.querySelector('body').classList.remove('scanner-active');
    this.scaner.stopScanner();
  }

  mostrarEncuestas() {
    this.verEncuestas = true;
  }
  esconderEncuestas() {
    this.verEncuestas = false;
  }

  async escanearQRmesa() {
    document.querySelector('body').classList.add('scanner-active');
    this.scanActivo = true;
    await this.scaner.startScan().then(async (result) => {
      this.numeroMesaQR = parseInt(result);
      if (this.numeroMesaQR == 1 || this.numeroMesaQR == 2 || this.numeroMesaQR == 3)
      {
        if (!this.ingreso) 
        {
          if(this.numeroMesa != 0) 
          {//tiene mesa asignada
                if (this.numeroMesaQR == this.numeroMesa) 
                {
                  this.scanActivo = false;
                  this.spinner = true;
                  await this.mesasService.asignarCliente(this.numeroMesa, this.auth.UsuarioActivo).then(() => {
                    this.escanerMesaOk = true;
                    this.ingreso = true;
                    this.mesasService.numeroMesa = this.numeroMesa;
                    this.mostrarMenu = false;
                    setTimeout(() => {
                      this.spinner = false;
                      this.router.navigateByUrl('menu-mesa');
                    }, 1000);
                    this.presentToast('Mesa escaneada', 'success', 'qr-code-outline');
                    this.scanActivo = false;
                  })
                }
                else {
                  this.presentToast('Escanee la mesa correcta', 'error', 'qr-code-outline');
                  this.scanActivo = false;
                  this.vibration.vibrate(1000);
                }
          } 
          else //metre no asigno mesa
          {
            if (!await this.mesasService.ConsultarMesaActiva(this.numeroMesaQR)) {
              this.presentToast('Mesa disponible', 'success', 'thumbs-up-outline');
              this.scanActivo = false;
            } else {
              this.presentToast('Error mesa no disponible!', 'danger', 'alert-circle-outline');
              this.scanActivo = false;
              this.vibration.vibrate(1000);
            }  
            this.scanActivo = false;
          }
        }
        else 
        {
          if (!await this.mesasService.ConsultarMesaActiva(this.numeroMesaQR)) {
            this.presentToast('Mesa disponible', 'success', 'thumbs-up-outline');
               this.scanActivo = false;
          } else {
            this.presentToast('Error mesa no disponible!', 'danger', 'alert-circle-outline');
            this.scanActivo = false;
            this.vibration.vibrate(1000);
          }
        }
      }
      else {
        this.presentToast('Error el QR no pertenece a una mesa.', 'danger', 'qr-code-outline');
        this.vibration.vibrate(1000);
        this.scanActivo = false;
      }
    }).catch((error) => {
      this.presentToast('Error al escanear el QR de la mesa', 'danger', 'qr-code-outline');
      this.spinner = false;
      this.scanActivo = false;
      this.vibration.vibrate(1000);
    });

  }

  enviarPushAMetre() {
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMetres,
        notification: {
          title: 'Lista de espera',
          body: '¡Hay un nuevo cliente esperando una mesa!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

}