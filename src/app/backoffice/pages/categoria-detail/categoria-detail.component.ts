import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Models } from 'src/app/models/models';
import { InteractionService } from '../../../services/interaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonRow } from "@ionic/angular/standalone";

@Component({
  selector: 'app-categoria-detail',
  templateUrl: './categoria-detail.component.html',
  styleUrls: ['./categoria-detail.component.scss'],
  standalone: false,
})
export class CategoriaDetailComponent  implements OnInit {


  private firestoreService: FirestoreService = inject(FirestoreService);
  private interactionService: InteractionService = inject(InteractionService);

  categoria = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  categoriaExist: Models.Tienda.Category;

  constructor(private router: Router,
              private route: ActivatedRoute)
   {
    this.getQueryParams();
   }

  ngOnInit() {}



    async save() {
      this.categoria.markAllAsTouched();
      console.log('this.categoria.valid -> ', this.categoria.valid);
      if (this.categoria.valid) {
        try {
          await this.interactionService.showLoading('Guardando...');
          const data = this.categoria.value;
          console.log('data -> ', data);
          const path = Models.Tienda.pathCategories;
          //await this.firestoreService.createDocument(path, data);
          // this.interactionService.dismissLoading();
           //this.interactionService.showToast('Guardado con éxito');
           //this.router.navigate(['/backoffice/ajustes/categorias']);

          if (this.categoriaExist) {
            await this.firestoreService.updateDocument(`${path}/${this.categoriaExist.id}`, data);
            await this.saveCategoryInProducts();
          } else {
            await this.firestoreService.createDocument(path, data);
          }

          this.interactionService.dismissLoading();
          this.interactionService.showToast('Guardado con éxito');

          const currentUrl = this.router.url;
          if (currentUrl !== '/backoffice/ajustes/categorias') {
            await this.router.navigate(['/backoffice/ajustes/categorias'], { replaceUrl: true });
          }

        } catch (error) {
          console.error(error);
          await this.interactionService.dismissLoading();
          this.interactionService.presentAlert('Error', 'No se pudo guardar');
        }
      }
    }

  getQueryParams() {
    this.route.queryParams.subscribe( (query: any) => {
        if (query.id) {
          this.loadCategory(query.id)
        }
    });
  }

  async loadCategory(id: string) {
    await this.interactionService.showLoading('Cargando...');
    const path = Models.Tienda.pathCategories;
    const response = await this.firestoreService.getDocument<Models.Tienda.Category>(`${path}/${id}`)
    this.interactionService.dismissLoading();
    if (response.exists()) {
      this.categoriaExist = response.data();
      this.categoria.setValue({
        name: this.categoriaExist.name,
        description: this.categoriaExist.description
      })
    }

  }

  async saveCategoryInProducts() {
    const path = Models.Tienda.pathProducts;
    const data = this.categoria.value;
    const category: Models.Tienda.Category = {
      name: data.name,
      description: data.description,
      id: this.categoriaExist.id
    }
    const updateDoc = {
      category
    }
    const response = await this.firestoreService.getDocumentsQuery(path,
        [['category.id', '==', this.categoriaExist.id]]);
    if (response.size) {
      const tasks: Promise<void>[] = [];
      response.docs.forEach( async doc => {
        // console.log('doc -> ', doc.data());
         const task = this.firestoreService.updateDocument(`${path}/${doc.id}`, updateDoc);
         tasks.push(task);
      });
      await Promise.all(tasks);
    }

  }

}
