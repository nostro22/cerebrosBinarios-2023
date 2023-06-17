import { Injectable, NgModule} from '@angular/core';
import { Router } from '@angular/router';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { ToastService } from './toast.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router:Router, public toastCtr:ToastService) { }
  token:string="";
  sePudo:boolean=false;

  login(email:string|any, password:string|any)
  {
    firebase.auth().signInWithEmailAndPassword(email, password).then(

      response=>{
        firebase.auth().currentUser?.getIdToken().then(
          token=>{
            this.token=token;
            this.sePudo=true;
            this.toastCtr.crearMensaje("Iniciar de sesión exitoso!", "success");
            this.router.navigate(['home']);
          }
        )
      }
    )
    .catch(
      error=>{
        this.sePudo=false;
        if(email=="" || password=="")
        {
          this.toastCtr.crearMensaje("Debe completar todos los campos para iniciar sesión ", "warning");
        }
        else
        {
          this.toastCtr.crearMensaje("Contraseña y/o correo incorrectos", "danger");
        }
      }
    )
  }

  getIdToken(){
    return this.token;
  }

  desloguear(){
    firebase.auth().signOut();
    this.token="";
    this.router.navigateByUrl("login");
  }

  getSeLogueo()
  {
    return this.sePudo;
  }

  getEmailUser(){
    return firebase.auth().currentUser?.email;
  }

}
