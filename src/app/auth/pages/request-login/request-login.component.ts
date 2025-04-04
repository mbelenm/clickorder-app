import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { OAuthProvider } from '@angular/fire/auth';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { UserService } from 'src/app/services/user.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { MenuController } from '@ionic/angular/standalone';
import { Auth, signInWithPopup, GoogleAuthProvider, getRedirectResult } from '@angular/fire/auth';


@Component({
  selector: 'app-request-login',
  templateUrl: './request-login.component.html',
  styleUrls: ['./request-login.component.scss'],
  standalone: false,
})
export class RequestLoginComponent  implements OnInit {

  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private firestoreService: FirestoreService = inject(FirestoreService);
  userService: UserService = inject(UserService);


  constructor(private route: ActivatedRoute,
              private router: Router,
              private interactionService: InteractionService,
              private menuController: MenuController) {

                this.getQueryParams();
                this.getTokenOfProvider();
                this.userService.validateHasProfile = false;
                this.menuController.enable(false, 'main')

  }

  ngOnInit() {

  }

  async getQueryParams() {
    const queryParams: any = this.route.snapshot.queryParams;
    console.log('queryParams -> ', queryParams);
    if (queryParams.provider && queryParams.intentId) {
      const provider = queryParams.provider;
      await this.interactionService.showLoading('Procesando...')
      this.authenticationService.loginWithProvider(provider)
      this.router.navigate(['/user/request-login'], { queryParams: { intentId: queryParams.intentId}})
    }

  }

  /*async getTokenOfProvider() {
      await this.interactionService.showLoading('Redirigiendo...')
      const result =  await this.authenticationService.getRedirectResult();
      console.log('getRedirectResult -> ', result);
      if (result) {
        const credential = OAuthProvider.credentialFromResult(result)
        console.log('credential -> ', credential);
        const token = credential.idToken ? credential.idToken : credential.accessToken;
        this.saveToken(token);
      } else {
        this.interactionService.dismissLoading();
      }
  }*/

      async getTokenOfProvider() {
        await this.interactionService.showLoading('Redirigiendo...');

        try {
            const result = await this.authenticationService.getRedirectResult(); // Espera la redirección
            console.log('getRedirectResult -> ', result);

            if (result && result.user) {
                const credential = OAuthProvider.credentialFromResult(result);
                console.log('credential -> ', credential);

                if (credential) {
                    const token = credential.idToken ? credential.idToken : credential.accessToken;
                    this.saveToken(token);
                } else {
                    console.log('No se pudo obtener la credencial');
                }
            } else {
                console.log('No se recibió un resultado de redirección válido');
            }
        } catch (error) {
            console.error('Error al obtener el resultado de redirección:', error);
        } finally {
            this.interactionService.dismissLoading();
        }
     }



  async saveToken(token: string) {
    const queryParams: any = this.route.snapshot.queryParams;
    const intentId = queryParams.intentId;
    // console.log('intentId -> ', intentId);
    // console.log('saveToken -> ', token);
    if (intentId) {
      const path = Models.Auth.PathIntentsLogin;
      const dataUpdate = { token };
      await this.firestoreService.updateDocument(`${path}/${intentId}`, dataUpdate);
      this.authenticationService.logout();
      console.log('guardado token con éxito');
    }
  }



}
