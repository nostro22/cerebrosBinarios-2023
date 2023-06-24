import { AuthService } from '../../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { PushService } from 'src/app/servicios/push.service';
import { MesasService } from 'src/app/servicios/mesas.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './inicio-mozo.page.html',
  styleUrls: ['./inicio-mozo.page.scss'],
})
export class InicioMozoPage implements OnInit {
  constructor(
    public mesasSrv: MesasService,
    private pushService: PushService,
    public auth: AuthService,
    public fire: FirestoreService,
    private router:Router
  ) {}

  listadoPedidosNoAprobados: any[] = [];
  listadoPedidosPreparados: any[] = [];
  tokenCocinerosBartenders: string[] = [];

  MostrarPreparados: boolean = false;
  MostrarNoAprobados: boolean = true;

  ngOnInit() {

    this.pushService.getUser();
    this.mesasSrv.TraerPedidos('no aceptado').subscribe((pedidos) => {
      this.listadoPedidosNoAprobados = pedidos;
    });

    this.mesasSrv.TraerPedidos('cocinado').subscribe((pedidos) => {
      this.listadoPedidosPreparados = pedidos;
    });

    this.mesasSrv.traerCocineros().subscribe((mozos: any) => {
      this.tokenCocinerosBartenders = [];
      mozos.forEach((element) => {
        if (element.token != '') {
          this.tokenCocinerosBartenders.push(element.token);
        }
      });
      console.log(this.tokenCocinerosBartenders);
    });
  }

  chatear()
  {
    this.router.navigate(['chat-consulta'])
  }

  MostrarVistaPreparados() {
    this.MostrarPreparados = true;
    this.MostrarNoAprobados = false;
  }

  MostrarVistaNoAprobados() {
    this.MostrarPreparados = false;
    this.MostrarNoAprobados = true;
  }

  AprobarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'aceptado').then(() => {
      this.enviarPushCocineros();
    });
  }

  enviarPushCocineros() {
    console.log(this.tokenCocinerosBartenders);
    this.pushService
      .sendPushNotification({
        registration_ids: this.tokenCocinerosBartenders,
        notification: {
          title: 'Nuevo Pedido',
          body: '¡Se aprobo un nuevo pedido!',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  EntregarPedido(pedido: any) {
    this.mesasSrv.CambiarEstadoPedido(pedido, 'entregado');
  }

  RechazarPedido(pedido: any) {
    this.mesasSrv.DesaprobarPedido(pedido);
  }

  cerrarSesion(){
    this.auth.LogOut();
  }
}
