import { Component, OnInit } from '@angular/core';
import { BarcodeScannerPlugin, BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { toastController } from '@ionic/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() { }


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
  }
}