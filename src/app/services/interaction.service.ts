import { Injectable } from '@angular/core';
import { AlertController, IonicSafeString,
  LoadingController, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private loading: HTMLIonLoadingElement

  constructor(private loadingCtrl: LoadingController,
          private toastCtrl: ToastController,
          private alertController: AlertController
  ) { }

  async showLoading(message: string = 'Cargando...') {
    this.loading = await this.loadingCtrl.create({ //mostrar al usaurio que estamos cargando
      message,
      backdropDismiss: false,
    });
    await this.loading.present();
  }

  async dismissLoading() { //cierre el loading
    if (this.loading) {
      await this.loading.dismiss();
    }
    this.loading = null;
  }

  async showToast(message: string, duration: number = 2000, position: "bottom" | "top" | "middle" = 'bottom') {
    const toast = await this.toastCtrl.create({ //mostrar un mensaje al usuario
      message,
      duration,
      position,
      color: 'dark'
    });
    await toast.present();
  }

  async presentAlert(header: string, message: string, textCANCEL: string = null, textOK: string = 'OK'): Promise<boolean> {
    return new Promise(  async  (resolve) => { //mostrar un mensaje de alerta al usuario
        let buttons = [];
        if (textCANCEL) {
            buttons.push( {
              text: textCANCEL,
              role: 'cancel',
              handler: () => {
                    resolve(false);
              }
            });
        }
        buttons.push({
          text: textOK,
          handler: async () => {
            resolve(true);
          }
        })
        const alert = await this.alertController.create({
            header,
            message: (new IonicSafeString(message)).value,
            // message,
            buttons,
            backdropDismiss: false
          });
        await alert.present();
    });
  }





}
