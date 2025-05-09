/*import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { InteractionService } from 'src/app/services/interaction.service';
import { StorageService } from 'src/app/firebase/storage.service';
import { FunctionsService } from 'src/app/firebase/functions.service';

@Component({
  selector: 'app-completar-registro',
  templateUrl: './completar-registro.component.html',
  styleUrls: ['./completar-registro.component.scss'],
  standalone: false,
})
export class CompletarRegistroComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService:   FirestoreService = inject(  FirestoreService);
  storageService: StorageService = inject(StorageService);
  functionsService: FunctionsService = inject(FunctionsService);

  cargando: boolean = false;

  user: User;
  userProfile: Models.Auth.UserProfile;

  datosFormCompleteRegistro = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    photo: [null],  // 🔹 Se eliminó Validators.required para que no sea obligatorio
      });


  constructor(private fb: FormBuilder,
              private router: Router,
              private interactionService: InteractionService) {


               this.user =  this.authenticationService.auth.currentUser;
               const photo: any = this.user.photoURL
               this.datosFormCompleteRegistro.setValue({
                  email: this.user.email,
                  name: this.user.displayName,
                  photo: photo

              }


            )
  }

  ngOnInit() {}

  async completarRegistro() {
    this.cargando = true;
    console.log('datosFormCompleteRegistro -> ', this.datosFormCompleteRegistro);

    if (this.datosFormCompleteRegistro.valid) {
      await this.interactionService.showLoading('Procensando...')
      const data = this.datosFormCompleteRegistro.value;
      console.log('valid -> ', data);
      try {

        let photo: any = data.photo;;
        if (typeof data.photo != 'string') {
          const foto: File = data.photo;
          const folder = `PhotosPerfil/${this.user.uid}`;
          const snapshot = await this.storageService.uploadFile(folder, foto.name, foto);
          const url = await this.storageService.getDownloadURL(snapshot.ref.fullPath);
          console.log('url -> ', url);
          photo = snapshot.ref.fullPath

        }

        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: photo
        };

        // https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg
        const user = this.authenticationService.getCurrentUser()
        await this.authenticationService.updateProfile(profile);
        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: photo,
          id: user.uid,
          email: data.email,
          roles: { cliente: true }
        }
        console.log('datosUser -> ', datosUser);

        // establecer rol por defecto en cliente en el módulo de autenticación
        const responseRol = await this.functionsService.call<any, any>('setRol', {})
        console.log('response -> ', responseRol);

        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, user.uid);
        console.log('completado registro con éxito');
        this.interactionService.showToast('Completado registro con éxito')
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
        this.datosFormCompleteRegistro.controls.photo.setValue(img);
        console.log('this.datosFormCompleteRegistro.controls.photo -> ', this.datosFormCompleteRegistro.controls.photo.value);

    }
  }

  salir() {
    this.authenticationService.logout();
  }

}

*/
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';
import { InteractionService } from 'src/app/services/interaction.service';
import { StorageService } from 'src/app/firebase/storage.service';
import { FunctionsService } from 'src/app/firebase/functions.service';

@Component({
  selector: 'app-completar-registro',
  templateUrl: './completar-registro.component.html',
  styleUrls: ['./completar-registro.component.scss'],
  standalone: false,
})
export class CompletarRegistroComponent implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  firestoreService: FirestoreService = inject(FirestoreService);
  storageService: StorageService = inject(StorageService);
  functionsService: FunctionsService = inject(FunctionsService);

  cargando: boolean = false;

  user: User;
  userProfile: Models.Auth.UserProfile;

  datosFormCompleteRegistro = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    photo: [null],  // 🔹 Se eliminó Validators.required para que no sea obligatorio
    age: [25, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private interactionService: InteractionService
  ) {
    this.user = this.authenticationService.auth.currentUser;
    const photo: any = this.user.photoURL;
    this.datosFormCompleteRegistro.setValue({
      email: this.user.email,
      name: this.user.displayName,
      photo: photo,
      age: 25
    });
  }

  ngOnInit() {}

  async completarRegistro() {
    this.cargando = true;
    console.log('datosFormCompleteRegistro -> ', this.datosFormCompleteRegistro);

    if (this.datosFormCompleteRegistro.valid) {
      await this.interactionService.showLoading('Procesando...');
      const data = this.datosFormCompleteRegistro.value;
      console.log('valid -> ', data);

      try {
        const user = this.authenticationService.getCurrentUser();
        if (!user) {
          console.log("Error: Usuario no autenticado");
          this.interactionService.presentAlert("Error", "Usuario no autenticado");
          return;
        }

        let photo: any = data.photo;

        if (!photo) {
          photo = user.photoURL || 'https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg';
        } else if (typeof photo !== 'string') {
          const foto: File = data.photo;
          const folder = `PhotosPerfil/${user.uid}`;
          const snapshot = await this.storageService.uploadFile(folder, foto.name, foto);
          photo = snapshot.ref.fullPath;
        }

        let profile: Models.Auth.UpdateProfileI = {
          displayName: data.name,
          photoURL: photo
        };

        await this.authenticationService.updateProfile(profile);

        const datosUser: Models.Auth.UserProfile = {
          name: data.name,
          photo: photo,
          id: user.uid,
          email: data.email,
          roles: { cliente: true }
        };

        console.log('datosUser -> ', datosUser);

        // 🔹 Llamada a setRol con parámetros correctos
        const responseRol = await this.functionsService.call<any, any>('setRol', { userId: user.uid, role: 'cliente' });
        console.log('response -> ', responseRol);

        await this.firestoreService.createDocument(Models.Auth.PathUsers, datosUser, user.uid);
        console.log('Registro completado con éxito');

        this.interactionService.showToast('Registro completado con éxito');
        await this.router.navigate(['/user/perfil'], { replaceUrl: true });
        this.interactionService.dismissLoading();

        setTimeout(() => {
          window.location.reload();
        }, 500);
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
      this.datosFormCompleteRegistro.controls.photo.setValue(img);
      console.log('this.datosFormCompleteRegistro.controls.photo -> ', this.datosFormCompleteRegistro.controls.photo.value);
    }
  }

  salir() {
    this.authenticationService.logout();
  }
}

