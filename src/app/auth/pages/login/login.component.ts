/*import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InteractionService } from '../../../services/interaction.service';
import { IonModal } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';  // Capacitor

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent  implements OnInit {

  authenticationService: AuthenticationService = inject(AuthenticationService);
  cargando: boolean = false;

  enableLoginWithEmailAndPassword: boolean = false;

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });


  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  reestablecerPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  @ViewChild('modalRecuperarPassword') modalRecuperarPassword: IonModal

  providers: Models.Auth.ProviderLoginI[] = [
    {
        name: 'Iniciar sesión con Google',
        id: 'google',
        color: '#20a3df',
        textColor: 'white',
        icon: 'logo-google'
    },
    {
      name: 'Iniciar sesión con correo y contraseña',
      id: 'password',
      color: '#9e9e9e',
      textColor: 'white',
      icon: 'mail'
    }
  ]

  constructor(private fb: FormBuilder,
              private router: Router,
              private interactionService: InteractionService) {
  }

  ngOnInit() {
  }

  async loginWithProvider(provider: Models.Auth.ProviderLoginI) {
    if (provider.id == 'password') {
      this.enableLoginWithEmailAndPassword = true;
      return;
    }
    await this.interactionService.showLoading('Procesando...');
    if (Capacitor.isNativePlatform()) {
      // Si estamos en una plataforma nativa (ej. móvil)
      const token = await this.authenticationService.getTokenOfProvider(provider.id);
      console.log(`token: ${token} para hacer el login con -> ${provider.id}`);
      const response = await this.authenticationService.loginWithTokenOfProvider(provider.id, token);
      this.interactionService.dismissLoading();

      console.log('response loginwithprovider -> ', response);
      if (response) {
        const user = response.user;
        this.interactionService.showToast(`Bienvenido ${user.displayName}`);
        setTimeout(() => {
          this.router.navigate(['user', 'perfil'], { replaceUrl: true });
        }, 200);
      }
    } else {
      // Si estamos en una plataforma web
      this.authenticationService.loginWithProvider(provider.id);
    }
  }



  async resetPassword() {
    if (this.reestablecerPasswordForm.valid) {
      const data = this.reestablecerPasswordForm.value;
      this.modalRecuperarPassword.dismiss();
      await this.interactionService.showLoading('Enviando correo...')
      console.log('resetPassword valid -> ', data);
      try {
        await this.authenticationService.sendPasswordResetEmail(data.email)
        this.interactionService.dismissLoading();
        this.interactionService.presentAlert('Importente',
            'Te hemos enviado un correo para reestablecer tu contraseña')
        console.log('te hemos enviado un correo para reestablecer tu contraseña');
      } catch (error) {
        console.log('resetPassword error -> ', error);
      }
    }


  }

  async loginWithEmail() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      await this.interactionService.showLoading('Ingresando...')
      try {
        const response = await this.authenticationService.login(data.email, data.password);
        this.interactionService.dismissLoading();
        const user = response.user;
        this.interactionService.showToast(`Bienvenido ${user.displayName}`)
        setTimeout(() => {
          this.router.navigate(['user', 'perfil'], {replaceUrl: true})
        }, 500);
      } catch (error) {
          console.log('login error -> ', error);
          this.interactionService.dismissLoading();
          this.interactionService.presentAlert('Error', 'Credenciales inválidas')
      }
    }
  }





}*/


import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { Models } from 'src/app/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InteractionService } from '../../../services/interaction.service';
import { IonModal } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';  // Capacitor

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  authenticationService: AuthenticationService = inject(AuthenticationService);
  cargando: boolean = false;
  enableLoginWithEmailAndPassword: boolean = false;

  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  reestablecerPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  @ViewChild('modalRecuperarPassword') modalRecuperarPassword: IonModal;

  providers: Models.Auth.ProviderLoginI[] = [
    {
      name: 'Iniciar sesión con Google',
      id: 'google',
      color: '#20a3df',
      textColor: 'white',
      icon: 'logo-google'
    },
    {
      name: 'Iniciar sesión con correo y contraseña',
      id: 'password',
      color: '#9e9e9e',
      textColor: 'white',
      icon: 'mail'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private interactionService: InteractionService
  ) {}

  ngOnInit() {
    // Verificar si el usuario ya está autenticado
    this.checkUserAuth();
  }

  // Método para comprobar el usuario autenticado
  async checkUserAuth() {
    const user = await this.authenticationService.getCurrentUser();
    if (user) {
      console.log('Usuario autenticado:', user);
      // Aquí puedes redirigir al usuario si está autenticado, por ejemplo:
      this.router.navigate(['user', 'perfil'], { replaceUrl: true });
    } else {
      console.log('No hay usuario autenticado.');
    }
  }

  // Otros métodos de login y reset password
  async loginWithProvider(provider: Models.Auth.ProviderLoginI) {
    if (provider.id == 'password') {
      this.enableLoginWithEmailAndPassword = true;
      return;
    }
    this.authenticationService.loginWithProvider(provider.id);
      await this.interactionService.showLoading('Procesando...');
    const token = await this.authenticationService.getTokenOfProvider(provider.id);
    console.log(`token: ${token} para hacer el login con -> ${provider.id}`);
    const response = await this.authenticationService.loginWithTokenOfProvider(provider.id, token);
    this.interactionService.dismissLoading();
    console.log('response loginwithprovider -> ', response);
    if (response) {
      const user = response.user;
      this.interactionService.showToast(`Bienvenido ${user.displayName}`);
      setTimeout(() => {
        this.router.navigate(['user', 'perfil'], { replaceUrl: true });
      }, 200);
    }
  }

  async resetPassword() {
    if (this.reestablecerPasswordForm.valid) {
      const data = this.reestablecerPasswordForm.value;
      this.modalRecuperarPassword.dismiss();
      await this.interactionService.showLoading('Enviando correo...');
      console.log('resetPassword valid -> ', data);
      try {
        await this.authenticationService.sendPasswordResetEmail(data.email);
        this.interactionService.dismissLoading();
        this.interactionService.presentAlert('Importente', 'Te hemos enviado un correo para reestablecer tu contraseña');
        console.log('te hemos enviado un correo para reestablecer tu contraseña');
      } catch (error) {
        console.log('resetPassword error -> ', error);
      }
    }
  }

  async loginWithEmail() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      await this.interactionService.showLoading('Ingresando...');
      try {
        const response = await this.authenticationService.login(data.email, data.password);
        this.interactionService.dismissLoading();
        const user = response.user;
        this.interactionService.showToast(`Bienvenido ${user.displayName}`);
        setTimeout(() => {
          this.router.navigate(['user', 'perfil'], { replaceUrl: true });
        }, 500);
      } catch (error) {
        console.log('login error -> ', error);
        this.interactionService.dismissLoading();
        this.interactionService.presentAlert('Error', 'Credenciales inválidas');
      }
    }
  }
}

