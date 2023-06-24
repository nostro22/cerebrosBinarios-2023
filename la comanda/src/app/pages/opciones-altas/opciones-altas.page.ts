import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-menu-altas',
  templateUrl: './opciones-altas.page.html',
  styleUrls: ['./opciones-altas.page.scss'],
})
export class OpcionesAltasPage implements OnInit {
  spinner: boolean = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {}

  cerrarSesion() {
    this.spinner = true;
    this.authService.LogOut().then(() => {
      this.spinner = false;
    });
  }
}
