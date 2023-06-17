import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { init } from 'emailjs-com';
init('ZU5FRFrh-eL6tI7f7');

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {}

  enviarAvisoPendienteAprobacion(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Para poder acceder a tu cuenta debes esperar que sea aprobada. Por favor ten paciencia.',
      from_name: 'Los Borbotones Restorán',
      reply_to: usuario.email,
    };

    emailjs
      .send('service_7wdzfm8', 'template_9kqtp5l', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }

  enviarAvisoCuentaAprobada(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Tu cuenta ha sido aprobada, ya puedes ingresar a la aplicación.',
      from_name: 'Los Borbotones Restorán',
      reply_to: usuario.email,
    };

    emailjs
      .send('service_7wdzfm8', 'template_9kqtp5l', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }

  enviarAvisoCuentaDeshabilitada(usuario: any) {
    const templateParams = {
      to_name: usuario.nombre,
      message:
        'Tu cuenta ha sido deshabilitada, por favor comunicate con nosotros para saber las causas.',
      from_name: 'Los Borbotones Restorán',
      reply_to: usuario.email,
    };

    emailjs
      .send('service_7wdzfm8', 'template_9kqtp5l', templateParams)
      .then((res) => {
        console.log('Email enviado.', res.status, res.text);
      })
      .catch((error) => {
        console.log('Error al enviar el email.', error.message);
      });
  }
}
