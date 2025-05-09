/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  c
})
export class CategoriasComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}*/
 import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Models } from 'src/app/models/models';
import { FirestoreService } from '../../../firebase/firestore.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  standalone: false,
  })
export class CategoriasComponent  implements OnInit, OnDestroy {

  private firestoreService: FirestoreService = inject(FirestoreService);
  private interactionService: InteractionService = inject(InteractionService);

  cargando: boolean;
  categories: Models.Tienda.Category[];
  categories$: Observable<Models.Tienda.Category[]>;

  s: Subscription;

  enableOptions: boolean = false;
  categorySelected: Models.Tienda.Category;



  constructor(private router: Router) {
    this.loadCategories()
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.s?.unsubscribe();
  }

  async loadCategories() {
    // this.cargando = true;
    // agregar permisos en la base de datos
    const path = Models.Tienda.pathCategories;
     this.categories$ = this.firestoreService.getDocumentsChanges(path)

    const extras: Models.Firestore.extrasQuery = {
      orderParam: 'date'
    }
    this.categories$ = this.firestoreService.getDocumentsQueryChanges(path, [[]], extras)

     this.s = this.firestoreService.getDocumentsChanges<Models.Tienda.Category>(path).subscribe( res => {
       console.log('loadCategories() -> ', res);
         this.categories = res;
     });

  }

  newCategorie() {
    this.router.navigate(['/backoffice/ajustes/categoria-detalle']);
  }

  editCategorie(category: Models.Tienda.Category) {
    /*if (this.enableOptions) {
      this.enableOptions = false;
      return;
    }*/
    console.log('editCategorie -> ', category.id);
    this.router.navigate(['/backoffice/ajustes/categoria-detalle'],
    { queryParams: {id: category.id}});
  }

  showOptions(event: any, category: Models.Tienda.Category) {
    //event.preventDefault()
    console.log('showOptions');
    this.enableOptions = true;
    event.preventDefault();
    this.categorySelected = category;
  }

  async delete() {
    console.log('delete -> ', this.categorySelected.name);
    const response = await this.interactionService.presentAlert('Importante',
          '¿Seguro que deseas eliminar esta categoria?', 'Cancelar', 'Eliminar');
    if (response) {
      const path = Models.Tienda.pathCategories;
      await this.interactionService.showLoading('Eliminando...');
      await this.firestoreService.deleteDocument(`${path}/${this.categorySelected.id}`);
      this.interactionService.dismissLoading();
      this.interactionService.showToast('Eliminado con éxito');
    }
    this.enableOptions = false;
    this.categorySelected = null;

  }





}
