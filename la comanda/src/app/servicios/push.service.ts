import { Injectable } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private user;

  constructor(
    private fs: FirestoreService,
    private authS: AuthService,
    private router: Router,
    private platform: Platform,
    private http: HttpClient,
    public afs: AngularFirestore
  ) { }

  async inicializar(): Promise<void> {
    this.addListeners();
    if (this.platform.is('capacitor') && this.user.token === '') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUser(): void {
    this.afs
      .collection('usuarios')
      .doc(this.authS.UsuarioActivo.uid)
      .valueChanges()
      .subscribe((usuario) => {
        this.user = usuario;
      });
    setTimeout(() => {
      this.inicializar();
    }, 3000);
  }

  sendPushNotification(req): Observable<any> {
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `key=${environment.fcmServerKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

  private async addListeners(): Promise<void> {
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('Registration token: ', token.value);
        this.user.token = token.value;
        this.fs.actualizarUsuario(this.user);
      }
    );

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
      }
    );
  }
}