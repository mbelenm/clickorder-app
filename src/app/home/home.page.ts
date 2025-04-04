import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton} from '@ionic/angular/standalone';
import {Models} from '../models/models';
import { InteractionService } from '../services/interaction.service';
import { FirestoreService } from '../firebase/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton],
})
export class HomePage {
    private firestoreService: FirestoreService= inject(FirestoreService);
    private interactionService:InteractionService=inject(InteractionService);
    constructor() {
      this.test()
      this.testLectura();
     }

 async test(){
  console.log('test ()');
   await this.firestoreService.createDocument('test', {name: 'Juan', lastName: 'Perez', age: 25});
}

testLectura(){
  this.firestoreService.getDocumentsChanges('test').subscribe(rest => {
    console.log('rest ->', rest);
  });
}

async save() {
  const response = await this.interactionService.presentAlert('Guardar', '¿Está seguro de guardar?', 'Cancelar', 'Guardar');
  console.log('response ->', response);
  await this.interactionService.showLoading('Cargando...');
  setTimeout(() => {
    this.interactionService.dismissLoading();
    this.interactionService.showToast('Guardado correctamente');
  }, 200);

}

}

