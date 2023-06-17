import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor() { }

  showLocalNotification(title: string, body: string, seconds: number, id: number = Math.floor(Math.random() * 1000) + 1): void {
    const at = new Date(Date.now() + seconds * 1000);
    LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: {
            at,
          },
        },
      ],
    });
  }

}