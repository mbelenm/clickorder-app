/*import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
        signOut, authState, updateProfile, updateEmail,
        sendEmailVerification, reauthenticateWithCredential,
      verifyBeforeUpdateEmail,
      updatePassword, sendPasswordResetEmail,
      deleteUser, signInWithRedirect,
      GoogleAuthProvider, OAuthProvider, FacebookAuthProvider,
      OAuthCredential, signInWithCredential, getRedirectResult,
    } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { environment } from 'src/environments/environment';
//import { Browser } from '@capacitor/browser';
import { Models } from '../models/models';
//import { NotificationsPushService } from '../services/notifications-push.service';

import { signInWithPopup } from '@angular/fire/auth';
import { InteractionService } from 'src/app/services/interaction.service'; // Asegúrate de importar esto
import { User } from "firebase/auth"; // Asegúrate de importar esto

import { NgZone } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
/*export class AuthenticationService {

  private firestoreService: FirestoreService = inject(FirestoreService);
  //private notificationsPushService = inject(NotificationsPushService)
  auth: Auth = inject(Auth);
  authState = authState(this.auth);

  constructor() {
    this.auth.languageCode = 'es';
  }*/

  /*export class AuthenticationService {

      private firestoreService: FirestoreService = inject(FirestoreService);  // Inyectar FirestoreService
      auth: Auth = inject(Auth);  // Inyectar Auth
      authState = authState(this.auth);
      private interactionService: InteractionService = inject(InteractionService);  // Inyectar InteractionService

      constructor() {
        this.auth.languageCode = 'es';
      }

  async createUser(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.sendEmailVerification();
    return user;
  }

  getCurrentUser() {
      return this.auth.currentUser
  }

  updateProfile(data: {displayName?: string, photoURL?: string}) {
     return updateProfile(this.auth.currentUser, data)
  }

  updateEmail(email: string) {
    return updateEmail(this.auth.currentUser, email)
  }

  verifyBeforeUpdateEmail(email: string) {
    return verifyBeforeUpdateEmail(this.auth.currentUser, email)
  }

  reauthenticateWithCredential(password: string) {
    const credential = GoogleAuthProvider.credential(null, password);
    return reauthenticateWithCredential(this.auth.currentUser, credential)
  }

  sendEmailVerification() {
    return sendEmailVerification(this.auth.currentUser)
  }

  updatePassword(newPasword: string) {
    return updatePassword(this.auth.currentUser, newPasword)
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(reload = true) {
   // await this.notificationsPushService.deleteToken();
    await signOut(this.auth);
    if (reload) {
      window.location.reload();
    }
  }

  deleteUser() {
    return deleteUser(this.auth.currentUser);
  }
*/
  /*loginWithProvider(providerId: string) {
     let provider;
     if (providerId == 'google') {
        provider = new GoogleAuthProvider();
     }
     if (providerId == 'apple') {
      provider = new OAuthProvider('apple.com');
     }
     if (providerId == 'facebook') {
      provider = new FacebookAuthProvider();
     }
     if (provider) {
       signInWithRedirect(this.auth, provider)
     }
  }*/

    /* async loginWithProvider(provider: string) {
      if (provider === 'google') {
        const googleProvider = new GoogleAuthProvider();
        googleProvider.addScope('email');
        googleProvider.addScope('profile');

        try {
          await this.interactionService.showLoading('Iniciando sesión...');
          const result = await signInWithPopup(this.auth, googleProvider);
          console.log('Resultado del login:', result);

          // Verificar si el usuario está autenticado
          const user = this.auth.currentUser;
          console.log('Usuario autenticado:', user);

          if (user) {
            const idToken = await user.getIdToken();
            console.log('ID Token obtenido:', idToken);
            this.saveToken(idToken); // Guardar el token manualmente
          } else {
            console.error('❌ Firebase no autenticó al usuario correctamente.');
          }
        } catch (error) {
          console.error('Error en login con popup:', error);
        } finally {
          this.interactionService.dismissLoading();
        }
      }
    }


    saveToken(token: string) {
      if (token) {
        console.log("Token guardado:", token);
        localStorage.setItem('authToken', token); // Guardar en localStorage
      } else {
        console.error("No se pudo guardar el token, ya que es NULL o UNDEFINED.");
      }
    }*/


  /*async getTokenOfProvider(providerId: string) {
    console.log('getTokenOfProvider -> ', providerId);
    const user = this.auth.currentUser;
    const idToken = user ? await user.getIdToken() : null;
    return new Promise<string>( async (resolve) => {
      try {
        const path = Models.Auth.PathIntentsLogin;
        const data: any = {
          provider: providerId,
          token: idToken
        }

        const id = await this.firestoreService.createDocument(path, data);
        const s = this.firestoreService.getDocumentChanges<any>(`${path}/${id}`).subscribe( async (response) => {
            if (response) {
                if (response.provider == providerId && response.token) {
                    console.log('login with token -> ', response);
                   // Browser.close()
                    s.unsubscribe();
                    this.firestoreService.deleteDocument(`${path}/${id}`)
                    resolve(response.token);
                }
            }
        });

         const link = `http://localhost:8100/user/request-login?provider=${providerId}&intentId=${id}`;
        //const link = `https://${environment.firebaseConfig.authDomain}/user/request-login?provider=${providerId}&intentId=${id}`;
        console.log('link -> ', link);
        //await Browser.open({ url: link });
      } catch (error) {
        console.log('getTokenOfProvider -> ', error);
        resolve(null);
      }
    })




  }*/

/*    async getTokenOfProvider(providerId: string) {
      console.log('getTokenOfProvider -> ', providerId);

      // Verificar si el usuario está autenticado
      if (!this.auth.currentUser) {
        console.error("No hay un usuario autenticado en Firebase.");
        return null;
      }

      // Esperar hasta obtener el usuario autenticado correctamente
      const user: User | null = await new Promise<User | null>((resolve) => {
        const unsubscribe = this.auth.onAuthStateChanged((firebaseUser) => {
          unsubscribe(); // Detener la escucha después de recibir el estado
          resolve(firebaseUser);
        });
      });

      // Validar si el usuario está autenticado
      if (!user) {
        console.error('❌ Error: No hay un usuario autenticado en Firebase.');
        return null;
      }

      // Obtener el token de autenticación
      const idToken = await user.getIdToken();

      return new Promise<string>(async (resolve) => {
        try {
          const path = Models.Auth.PathIntentsLogin;
          const data: any = {
            provider: providerId,
            token: idToken
          };

          const id = await this.firestoreService.createDocument(path, data);
          const s = this.firestoreService.getDocumentChanges<any>(`${path}/${id}`).subscribe(async (response) => {
            if (response && response.provider == providerId && response.token) {
              console.log('✅ Login con token -> ', response);
              s.unsubscribe();
              this.firestoreService.deleteDocument(`${path}/${id}`);
              resolve(response.token);
            }
          });

          const link = `http://localhost:8100/user/request-login?provider=${providerId}&intentId=${id}`;
          console.log('🔗 Link de autenticación -> ', link);

        } catch (error) {
          console.error('❌ Error en getTokenOfProvider -> ', error);
          resolve(null);
        }
      });
    }


  async loginWithTokenOfProvider(providerId: string, token: string) {
    console.log('Token recibido en loginWithTokenOfProvider:', token);

    // 🔹 Verificar si el token es null o undefined antes de continuar
    if (!token) {
      console.error('El token es NULL o UNDEFINED. No se puede iniciar sesión.');
      return null;
    }

    let credential: OAuthCredential;
    switch (providerId) {
      case 'google':
        credential = GoogleAuthProvider.credential(token);
        break;
      case 'apple':
        const OAuth = new OAuthProvider('apple.com');
        credential = OAuth.credential({ idToken: token });
        break;
      case 'facebook':
        credential = FacebookAuthProvider.credential(token);
        break;
    }

    // 🔹 Si no se pudo generar la credencial, retornar null
    if (!credential) {
      console.error('No se pudo generar la credencial de autenticación.');
      return null;
    }

    return await signInWithCredential(this.auth, credential);
  }

  getRedirectResult() {
    return getRedirectResult(this.auth)
  }



}*/




import { Injectable, inject } from '@angular/core';
import {
    Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, authState, updateProfile, updateEmail,
    sendEmailVerification, reauthenticateWithCredential,
    verifyBeforeUpdateEmail, updatePassword, sendPasswordResetEmail,
    deleteUser, signInWithRedirect, GoogleAuthProvider, OAuthProvider,
    FacebookAuthProvider, OAuthCredential, signInWithCredential,
    getRedirectResult
} from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { environment } from 'src/environments/environment';
import { Models } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private firestoreService: FirestoreService = inject(FirestoreService);
  auth: Auth = inject(Auth);
  authState = authState(this.auth);

  constructor() {
    this.auth.languageCode = 'es';
  }

  async createUser(email: string, password: string) {
    const user = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.sendEmailVerification();
    return user;
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  updateProfile(data: { displayName?: string; photoURL?: string }) {
    if (!this.auth.currentUser) return Promise.reject("Usuario no autenticado");
    return updateProfile(this.auth.currentUser, data);
  }

  updateEmail(email: string) {
    if (!this.auth.currentUser) return Promise.reject("Usuario no autenticado");
    return updateEmail(this.auth.currentUser, email);
  }

  verifyBeforeUpdateEmail(email: string) {
    if (!this.auth.currentUser) return Promise.reject("Usuario no autenticado");
    return verifyBeforeUpdateEmail(this.auth.currentUser, email);
  }

  reauthenticateWithCredential(password: string) {
    if (!this.auth.currentUser) return Promise.reject("Usuario no autenticado");
    const credential = GoogleAuthProvider.credential(null, password);
    return reauthenticateWithCredential(this.auth.currentUser, credential);
  }

  sendEmailVerification() {
    if (!this.auth.currentUser) return Promise.reject("Usuario no autenticado");
    return sendEmailVerification(this.auth.currentUser);
  }

  updatePassword(newPassword: string) {
    if (!this.auth.currentUser) return Promise.reject("Usuario no autenticado");
    return updatePassword(this.auth.currentUser, newPassword);
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(reload = true) {
    await signOut(this.auth);
    if (reload) {
      window.location.reload();
    }
  }

  deleteUser() {
    if (!this.auth.currentUser) return Promise.reject("Usuario no autenticado");
    return deleteUser(this.auth.currentUser);
  }

  loginWithProvider(providerId: string) {
    let provider;
    if (providerId === 'google'){
      provider = new GoogleAuthProvider();
    }
      signInWithRedirect(this.auth, provider);
  }

  async getTokenOfProvider(providerId: string) {
    console.log('getTokenOfProvider -> ', providerId);
    return new Promise<string>(async (resolve) => {
      try {
        const path = Models.Auth.PathIntentsLogin;
        const data: any = { provider: providerId, token: null };
        const id = await this.firestoreService.createDocument(path, data);
        const s = this.firestoreService.getDocumentChanges<any>(`${path}/${id}`).subscribe(async (response) => {
          if (response?.provider === providerId && response.token) {
            console.log('Login con token -> ', response);
            s.unsubscribe();
            this.firestoreService.deleteDocument(`${path}/${id}`);
            resolve(response.token);

          }
        });




        const link = `https://${environment.firebaseConfig.authDomain}/user/request-login?provider=${providerId}&intentId=${id}`;
        console.log('Link de autenticación -> ', link);
      } catch (error) {
        console.error('Error en getTokenOfProvider:', error);
        resolve(null);
      }
    });
  }

  async loginWithTokenOfProvider(providerId: string, token: string) {
    if (!token) {
      console.error("Error: Token inválido o vacío.");
      return null;
    }

    let credential: OAuthCredential | null = null;

    try {
      switch (providerId) {
        case 'google':
          credential = GoogleAuthProvider.credential(token);
          break;
        case 'apple':
          credential = new OAuthProvider('apple.com').credential({ idToken: token });
          break;
        case 'facebook':
          credential = FacebookAuthProvider.credential(token);
          break;
        default:
          console.error("Error: Proveedor no soportado ->", providerId);
          return null;
      }

      if (!credential) {
        console.error("Error: No se pudo generar la credencial.");
        return null;
      }

      return await signInWithCredential(this.auth, credential);
    } catch (error) {
      console.error("Error en loginWithTokenOfProvider:", error);
      return null;
    }
  }

  getRedirectResult() {
    return getRedirectResult(this.auth);
  }
}

