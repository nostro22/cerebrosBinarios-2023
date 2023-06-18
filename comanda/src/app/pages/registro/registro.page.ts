import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from '../../services/photo.service';
import { QrscannerService } from '../../services/qrscanner.service';
import { uploadString } from 'firebase/storage';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  user: any = null;
  userAuth: any = this.angularFireAuth.authState;
  pressedButton: boolean = false;

  scanActive: boolean = false;

  form: FormGroup | any;

  newUser: any = {};
  usersList: any[] = [];
  content: any[] = [];
  userPhoto: string = '../../assets/hombre-de-negocios.png';

  isAdmin: boolean = false;
  formCreate: boolean = false;
  userList: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private qrScanner: QrscannerService,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private photoService: PhotoService,
    private firestoreService: FirestoreService
  ) {
  }

  ngOnInit(): void {
    this.pressedButton = true;
    this.form = this.formBuilder.group({
      apellidos: ['', Validators.required],
      nombres: ['', Validators.required],
      dni: ['', Validators.required],
      correo: ['', Validators.required],
      clave1: ['', Validators.required],
      clave2: ['', Validators.required],
    });
    // this.authService.user$.subscribe((user: any) => {
    //   if (user) {
    //     this.pressedButton = false;
    //     this.user = user;
    //     this.qrScanner.scanPrepare();
    //     this.userAuth = this.angularFireAuth.authState.subscribe((user) => {
    //       this.userAuth = user;
    //     });
    //     if (this.user.userRol == 'admin') {
    //       this.isAdmin = true;
    //       this.formCreate = true;
    //       this.userList = false;
    //     } else {
    //       this.isAdmin = false;
    //       this.formCreate = false;
    //       this.userList = true;
    //     }
    //   }
    // });
    // this.firestoreService.getUsers().subscribe((users:any) => {
    //   this.usersList = users;
    //   this.usersList.sort(this.orderByLastName);
    // });
    this.isAdmin = true;
    this.formCreate = true;
    this.userList = false;
  }

  logoutUser() {
    this.authService.signOut();
    setTimeout(() => {
      this.isAdmin = false;
      this.formCreate = false;
      this.userList = false;
      this.authService.toast('Sesión cerrada con exito. Adiós', 'success');
    }, 2100);
  }

  startScan() {
    this.pressedButton = true;
    setTimeout(() => {
      this.pressedButton = false;
      this.scanActive = true;
      this.qrScanner.startScan().then((result:any) => {
        // alert(result);
        this.content = result.split('@');
        // alert(this.content);
        // alert(this.content.length);
        this.form.setValue({
          apellidos:
            this.content[1].charAt(0) +
            this.content[1].slice(1).toLocaleLowerCase(),
          nombres:
            this.content[2].split(' ')[0].charAt(0) +
            this.content[2].split(' ')[0].slice(1).toLocaleLowerCase() +
            ' ' +
            this.content[2].split(' ')[1].charAt(0) +
            this.content[2].split(' ')[1].slice(1).toLocaleLowerCase(),
          dni: this.content[4],
          correo: this.form.getRawValue().correo,
          clave1: this.form.getRawValue().clave1,
          clave2: this.form.getRawValue().clave2,
        });
        // this.authService.toast('DNI escaneado', 'success');
        this.scanActive = false;
      })
      .catch((error:any)=>{
        alert(error);
      })
    }, 2000);
  } 

  stopScan() {
    this.pressedButton = true;
    setTimeout(() => {
      this.pressedButton = false;
      this.scanActive = false;
      this.qrScanner.stopScanner();
    }, 2000);
  }

  updateUser() {
    this.angularFirestore
      .doc<any>(`user/${this.userAuth.uid}`)
      .update({
        userCredit: this.user.userCredit,
        userEmail: this.user.userEmail,
        userId: this.user.userId,
        userName: this.user.userName,
        userQrCredit: this.user.userQrCredit,
        userRol: this.user.userRol,
        userSex: this.user.userSex,
      })
      .then(() => {})
      .catch((error) => {});
  }

  createUser() {
    if (this.form.valid) {
      if (this.form.value.clave1 == this.form.value.clave2) {
        if (this.newUser.userPhoto) {
          this.newUser.userLastName = this.form.value.apellidos;
          this.newUser.userName = this.form.value.nombres;
          this.newUser.userDni = this.form.value.dni;
          this.newUser.userEmail = this.form.value.correo;
          this.newUser.userPassword = this.form.value.clave1;
          this.newUser.userUid = this.form.value.clave1
          
          this.pressedButton = true;
          setTimeout(() => {
            this.authService
              .registerManagedUsers(this.newUser)
              .then((usuario:any) => {
                this.form.reset();
                this.newUser.userUid = usuario.user.uid;
                this.firestoreService.addUser(this.newUser);
                this.guardarUser(this.newUser);
                this.authService.toast(
                  '¡Usuario registrado con exito!',
                  'success'
                );
                this.userPhoto = '../../assets/user-default.png';
              })
              .catch((error:any) => {
                this.authService.toast(
                  this.authService.createMessage(error.code),
                  'danger'
                );
              });
            this.pressedButton = false;
          }, 2000);
        } else {
          this.authService.toast('Debes cargar una foto', 'danger');
        }
      } else {
        this.authService.toast('Las claves deben coincidir', 'danger');
      }
    } else {
      this.authService.toast(
        'Todos los campos deben estar completos y la foto seleccionada',
        'danger'
      );
    }
  }

  guardarUser(usuario:any)
  {
    const collectionRef = this.angularFirestore.collection('user');
    const documentoID = usuario.userUid;
    const datosDocumento = {
      userEmail: usuario.userEmail,
      userId: '10',
      userName: usuario.userName,
      userRol: 'usuario',
      userSex: 'femenino',
      userUid: usuario.userUid,
    };

    collectionRef.doc(documentoID).set(datosDocumento)
      .then(() => {
        console.log('Documento agregado con éxito');

      })
      .catch((error) => {
        console.log('Error al agregar el documento:', error);
      });
  }

  addPhotoToUser() {
    if (this.form.valid) {
      this.newUser = {
        userLastName: this.form.value.apellidos,
        userName: this.form.value.nombres,
        userDni: this.form.value.dni,
        userEmail: this.form.value.correo,
        userPassword: this.form.value.clave1,
        userPhoto: '',
      };

      this.pressedButton = true;
      setTimeout(() => {
        this.photoService.addNewToGallery(this.newUser).then((data:any) => {
          uploadString(data.storage, data.dataurl, 'data_url').then(() => {
            data.url.getDownloadURL().subscribe((url1: any) => {
              this.newUser.userPhoto = url1;
              this.userPhoto = url1;
              this.authService.toast('Foto Agregada!', 'success');
              this.pressedButton = false;
            });
          });
        });
      }, 2000);
    } else {
      this.authService.toast(
        'Se deben completar todos los campos',
        'danger'
      );
    }
  }

  orderByLastName(a: any, b: any) {
    if (a.userLastName > b.userLastName) {
      return 1;
    } else if (a.userLastName < b.userLastName) {
      return -1;
    } else {
      return 0;
    }
  }

  goToUsersList() {
    this.pressedButton = true;
    setTimeout(() => {
      this.formCreate = false;
      this.userList = true;
      this.pressedButton = false;
    }, 2000);
  }

  goToCreateUser() {
    this.pressedButton = true;
    setTimeout(() => {
      this.formCreate = true;
      this.userList = false;
      this.pressedButton = false;
    }, 2000);
  }

}
