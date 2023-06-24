import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
@Injectable({
  providedIn: 'root'
})
export class QrscannerService {

  constructor() { }

  async startScan() {
    document.querySelector('body').classList.add('scanner-active');
    await BarcodeScanner.checkPermission({force:true});
    BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan();
    if(result.hasContent) {
      document.querySelector('body').classList.remove('scanner-active');
      return result.content;
    }
  } 

  stopScanner() {
    document.querySelector('body').classList.remove('scanner-active');
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  } 

  scanPrepare() {
    BarcodeScanner.prepare();
  } 
}
