import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MesasService } from 'src/app/servicios/mesas.service';
import {ToastController } from '@ionic/angular';
import { PushService } from 'src/app/servicios/push.service';

@Component({
  selector: 'app-menu',
  templateUrl: './minuta.component.html',
  styleUrls: ['./minuta.component.scss'],
})
export class MinutasComponent implements OnInit {

  listadoProductos: any[] = [];
  pedido: any[] = [];
  total = 0;
  MostrarMenu = true;
  MostrarPedido = false;
  spinner = false;
  tiempoMaximo = 0;
  tokenMozos: string[] = [];

  @Input() numeroMesa: any;
  @Output() pedidoFinal?: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private toastController: ToastController,
    public mesasSrv: MesasService,
    private pushService: PushService
  ) { }

  ngOnInit() {
    this.loadProductos();
    this.spinner = true;
    this.loadMozos();
  }

  async loadProductos() {
    this.listadoProductos = await this.mesasSrv.traerProductos().toPromise();
  }

  async loadMozos() {
    const mozos: any = await this.mesasSrv.traerMozos().toPromise();
    this.tokenMozos = mozos
      .filter((element: any) => element.token !== '')
      .map((element: any) => element.token);
  }

  enviarPushMozos() {
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenMozos,
        notification: {
          title: 'Nuevo Pedido',
          body: `¡El cliente en la mesa ${this.numeroMesa} hizo un pedido!`,
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  async hacerPedido() {
    this.spinner = true;

    const pedidoFormato = {
      productos: this.pedido,
      estado: 'no aceptado',
      total: this.total,
      mesa: this.numeroMesa,
      tiempoPreparacion: this.tiempoMaximo,
      comienzo: new Date(),
      propina: 0,
      descuentoJuego: 0,
      jugo: false,
      porcentajePropina: 0,
      uid: '',
    };

    await this.mesasSrv.hacerPedido(pedidoFormato);
    this.spinner = false;
    this.pedidoFinal.emit(pedidoFormato);
    this.enviarPushMozos();
  }

  agregarAlPedido(Producto: any) {
    this.pedido.push(Producto);
    this.actualizarTotal();
  }

  quitarDelPedido(Producto: any) {
    const index = this.pedido.findIndex((prod) => prod.uid === Producto.uid);
    if (index !== -1) {
      this.pedido.splice(index, 1);
    }
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.total = 0;
    let banderaPrime = true;
    this.pedido.forEach((prod) => {
      if (banderaPrime) {
        this.tiempoMaximo = prod.tiempoElaboracion;
        banderaPrime = false;
      } else {
        if (prod.tiempoElaboracion > this.tiempoMaximo) {
          this.tiempoMaximo = prod.tiempoElaboracion;
        }
      }
      this.total += parseFloat(prod.precio);
    });
  }

  verPedido() {
    this.MostrarMenu = false;
    this.MostrarPedido = true;
  }

  async presentToast(mensaje: string, color: string, icono: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      icon: icono,
      color: color,
    });

    await toast.present();
  }
}