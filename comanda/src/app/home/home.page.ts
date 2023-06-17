import { Component, OnInit } from '@angular/core';
import { BarcodeScannerPlugin, BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { toastController } from '@ionic/core';
import { PushNotificationService } from '../services/push-notification.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private localNotificationsService: PushNotificationService) {}

  createReminder(): void {
    const title = 'Reminder Title';
    const body = 'Reminder Body';
    const seconds = 3; // Display the notification 10 seconds after it's created
    this.localNotificationsService.showLocalNotification(title, body, seconds);
  }


  async startScan() {
    BarcodeScanner.startScanning();
    await BarcodeScanner.checkPermission({ force: true });
    BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      return result.content;
    }
    return true;
  } // end of startScan

  stopScanner() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  } // end of stopScanner

  scanPrepare() {
    BarcodeScanner.prepare();
  } // end of scanPrepare

  ngOnInit() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    
    
  }
}