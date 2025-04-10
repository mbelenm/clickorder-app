import { IonHeader, IonButtons, IonIcon, IonButton, IonTitle, IonToolbar, IonContent, IonMenuButton,IonFooter, IonBackButton,IonGrid, IonRow,  IonCol,  IonCard,  IonCardContent,  IonLabel, IonList,IonInfiniteScroll, IonInfiniteScrollContent,IonFab,
  IonFabButton,IonItem,IonSpinner, IonTextarea,IonRouterLink,IonListHeader,IonSelect,IonSelectOption,IonBadge} from '@ionic/angular/standalone';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BackofficeRoutingModule } from './backoffice-routing.module';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { CategoriaDetailComponent } from './pages/categoria-detail/categoria-detail.component';
import { ProductoDetailComponent } from './pages/producto-detail/producto-detail.component';
import { SharedModule } from '../shared/shared.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@NgModule({
  declarations: [
    AjustesComponent,
    CategoriasComponent,
    ProductosComponent,
    CategoriaDetailComponent,
    ProductoDetailComponent

  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,IonFooter, IonToolbar, IonTitle, IonButtons, IonButton,IonIcon,IonToolbar,IonContent,IonMenuButton,IonBackButton, IonGrid, IonRow,  IonCol,  IonCard,  IonCardContent,  IonLabel, IonList,
    IonInfiniteScroll, IonInfiniteScrollContent,IonSpinner,IonFab, IonFabButton,IonItem, IonTextarea, IonRouterLink, IonListHeader, IonSelect, IonSelectOption, IonBadge,SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BackofficeModule { }
