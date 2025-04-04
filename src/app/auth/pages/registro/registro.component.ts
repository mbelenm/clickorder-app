/*import { InteractionService } from './../../../services/interaction.service';
import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/firebase/storage.service';
import { UserService } from 'src/app/services/user.service';
import { FunctionsService } from 'src/app/firebase/functions.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: false,
  })
export class RegistroComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService: FirestoreService = inject(  FirestoreService);
  storageService: StorageService = inject(StorageService);
  userService: UserService = inject(UserService);
  functionsService: FunctionsService = inject(FunctionsService);

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: [null]
  });

  cargando: boolean = false;


  constructor(private fb: FormBuilder,
              private router: Router,
              private interactionService: InteractionService) {
              }

  async ngOnInit() {}

  async registrarse() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);
    if (this.datosForm.valid) {
      const data = this.datosForm.value;
      console.log('valid -> ', data);
      try {
        await this.interactionService.showLoading('Registrando...');
        const foto: File = data.photo;
        this.userService.validateHasProfile = false;
        const res =  await this.authenticationService.createUser(data.email, data.password)
        const folder = `PhotosPerfil/${res.user.uid}`;
        const snapshot = await this.storageService.uploadFile(folder, foto.name, foto);
        const url = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
        console.log('url -> ', url);

        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: snapshot.ref.fullPath
        };
        // https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg'
        // https://cdn.pixabay.com/photo/2021/01/04/10/37/icon-5887113_1280.png
        // https://static.vecteezy.com/system/resources/previews/001/993/889/non_2x/beautiful-latin-woman-avatar-character-icon-free-vector.jpg
        await this.authenticationService.updateProfile(profile);

        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: snapshot.ref.fullPath,
          //age: data.age,
          id: res.user.uid,
          email: data.email,
          roles: { cliente: true}
        }
        console.log('datosUser -> ', datosUser);

        // establecer rol por defecto en cliente en el módulo de autenticación
        const responseRol = await this.functionsService.call<any, any>('setRol', {})
        console.log('response -> ', responseRol);

        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
        this.interactionService.showToast('Usuario creado con éxito')
        console.log('usuario creado con éxito');
        await this.router.navigate(['/user/perfil'])
        this.interactionService.dismissLoading();
        window.location.reload();
      } catch (error) {
        console.log('registrarse error -> ', error);
        this.interactionService.presentAlert('Error', 'Ocurrió un error, intenta nuevamente')
      }
    }
    this.cargando = false;
  }

  async viewPreview(input: HTMLInputElement) {
    if (input.files.length) {
        const files = input.files;
        console.log('viewPreview files -> ', files);
        const img: any = files.item(0)
        this.datosForm.controls.photo.setValue(img);
        console.log('this.datosForm.controls.photo -> ', this.datosForm.controls.photo.value);

    }
  }

  download(path: string) {
    this.storageService.downloadFile(path)
  }




} */

/*export class RegistroComponent implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService: FirestoreService = inject(FirestoreService);
  storageService: StorageService = inject(StorageService);
  userService: UserService = inject(UserService);
  functionsService: FunctionsService = inject(FunctionsService);

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: [null], // ❌ Se eliminó Validators.required para que no sea obligatorio
    age: [25, Validators.required],
  });

  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private interactionService: InteractionService) {
              }

  async ngOnInit() {}

  async registrarse() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);

    if (this.datosForm.valid) {
      const data = this.datosForm.value;
      console.log('valid -> ', data);

      try {
        await this.interactionService.showLoading('Registrando...');
        this.userService.validateHasProfile = false;
        const res = await this.authenticationService.createUser(data.email, data.password);

        let photoURL = null; // 📌 Por defecto, la foto es null

        if (data.photo && typeof data.photo !== 'string') {
          const foto: File = data.photo;
          const folder = `PhotosPerfil/${res.user.uid}`;
          const snapshot = await this.storageService.uploadFile(folder, foto.name, foto);
          photoURL = snapshot.ref.fullPath; // 📌 Guardar la URL de la foto solo si existe
          console.log('url -> ', photoURL);
        }

        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: photoURL // 📌 Si no hay foto, queda null
        };

        await this.authenticationService.updateProfile(profile);

        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: photoURL, // 📌 Si no hay foto, se guarda null en Firestore
          age: data.age,
          id: res.user.uid,
          email: data.email,
          roles: { cliente: true }
        };

        console.log('datosUser -> ', datosUser);

        // establecer rol por defecto en cliente en el módulo de autenticación
        const responseRol = await this.functionsService.call<any, any>('setRol', {});
        console.log('response -> ', responseRol);

        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
        this.interactionService.showToast('Usuario creado con éxito');
        console.log('usuario creado con éxito');
        await this.router.navigate(['/user/perfil']);
        this.interactionService.dismissLoading();
        window.location.reload();
      } catch (error) {
        console.log('registrarse error -> ', error);
        this.interactionService.presentAlert('Error', 'Ocurrió un error, intenta nuevamente');
      }
    }

    this.cargando = false;
  }

  async viewPreview(input: HTMLInputElement) {
    if (input.files.length) {
      const files = input.files;
      console.log('viewPreview files -> ', files);
      const img: any = files.item(0);
      this.datosForm.controls.photo.setValue(img);
      console.log('this.datosForm.controls.photo -> ', this.datosForm.controls.photo.value);
    }
  }

  download(path: string) {
    this.storageService.downloadFile(path);
  }
}*/


import { InteractionService } from './../../../services/interaction.service';
import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/firebase/storage.service';
import { UserService } from 'src/app/services/user.service';
import { FunctionsService } from 'src/app/firebase/functions.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: false,
})
export class RegistroComponent implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService: FirestoreService = inject(FirestoreService);
  storageService: StorageService = inject(StorageService);
  userService: UserService = inject(UserService);
  functionsService: FunctionsService = inject(FunctionsService);

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    name: ['', Validators.required],
    photo: [null]
  });

  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private interactionService: InteractionService
  ) {}

  async ngOnInit() {}

  async registrarse() {
    this.cargando = true;
    console.log('datosForm -> ', this.datosForm);

    // Verificamos si el formulario es válido y si 'name' tiene valor
    const data = this.datosForm.value;
    if (this.datosForm.valid && data.name) {
      try {
        await this.interactionService.showLoading('Registrando...');
        const foto: File = data.photo;
        this.userService.validateHasProfile = false;
        const res = await this.authenticationService.createUser(data.email, data.password);
        const folder = `PhotosPerfil/${res.user.uid}`;

        // Si se pasa una foto, la subimos a Firebase Storage
        let url = '';
        if (foto) {
          const snapshot = await this.storageService.uploadFile(folder, foto.name, foto);
          url = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
        }

        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: url || 'default-photo-url.jpg' // Si no hay foto, establecemos una foto predeterminada
        };

        await this.authenticationService.updateProfile(profile);

        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: url || 'default-photo-url.jpg',
          id: res.user.uid,
          email: data.email,
          roles: { cliente: true }
        };

        console.log('datosUser -> ', datosUser);

        // Establecer rol por defecto en cliente en el módulo de autenticación
        //const responseRol = await this.functionsService.call<any, any>('setRol', {});
       // console.log('response -> ', responseRol);

        // Guardar el usuario en Firestore
        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, res.user.uid);
        this.interactionService.showToast('Usuario creado con éxito');
        console.log('usuario creado con éxito');

        // Navegar al perfil del usuario
        await this.router.navigate(['/user/perfil']);
        this.interactionService.dismissLoading();
        window.location.reload();
      } catch (error) {
        console.log('registrarse error -> ', error);
        this.interactionService.presentAlert('Error', 'Ocurrió un error, intenta nuevamente');
      }
    } else {
      // Si el formulario no es válido o el nombre está vacío
      this.interactionService.presentAlert('Error', 'Por favor completa todos los campos correctamente.');
    }

    this.cargando = false;
  }

  async viewPreview(input: HTMLInputElement) {
    if (input.files.length) {
      const files = input.files;
      console.log('viewPreview files -> ', files);
      const img: any = files.item(0);
      this.datosForm.controls.photo.setValue(img);
      console.log('this.datosForm.controls.photo -> ', this.datosForm.controls.photo.value);
    }
  }

  download(path: string) {
    this.storageService.downloadFile(path);
  }
}
