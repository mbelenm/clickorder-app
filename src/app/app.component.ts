import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonContent, IonToolbar, IonHeader, IonTitle, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { IoniconsService } from './services/ionicons.service';
import { IonMenu } from '@ionic/angular/standalone';
import { SidemenuComponent } from './shared/components/sidemenu.component';
import { IonMenuButton } from '@ionic/angular/standalone'; // 👈 AGREGALO


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonIcon, IonButtons, IonTitle, IonHeader, IonToolbar, IonContent, IonSplitPane, IonApp, IonRouterOutlet,IonMenu, SidemenuComponent, IonMenuButton],
})
export class AppComponent {
  private IoniconsService: IoniconsService= inject(IoniconsService);
  constructor() {
    this.IoniconsService.loadAllIcons()

  }
}
