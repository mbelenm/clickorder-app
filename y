{
  "indexes": [],
  "fieldOverrides": []
}

<!--<p-stepper orientation="vertical">
<p-stepperPanel header="Productos">
    <ng-template pTemplate="content" let-nextCallback="nextCallback" let-index="index">
      <ion-grid fixed>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" sizeMd="8">



             <ion-list>
               <ion-list-header>
                <ion-label>Productos:</ion-label>
              </ion-list-header>


                @for (item of carrito?.items; track $index) {
                  <app-item-carrito [item]="item"></app-item-carrito>
              }

           </ion-list>


          </ion-col>
        </ion-row>
      </ion-grid>
        <div class="flex pt-4 justify-content-end">
          <ion-chip (click)="nextCallback.emit()" fill="solid" shape="round" color="primary">
            <ion-label> siguiente</ion-label>
            <ion-icon  name="arrow-forward"></ion-icon>
          </ion-chip>
        </div>
    </ng-template>
</p-stepperPanel>
<p-stepperPanel header="Datos">
    <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback" let-index="index">
         <div class="flex flex-column h-12rem">
            <div class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                 Content II
                <app-datos-pedido></app-datos-pedido>-
             </div>
        </div>
                    <div class="flex pt-4 justify-content-between">
                <ion-chip (click)="prevCallback.emit()" fill="solid" shape="round" color="dark">
                  <ion-icon  name="arrow-back"></ion-icon>
                  <ion-label>retroceder</ion-label>
                </ion-chip>
                <ion-chip (click)="nextCallback.emit()" fill="solid" shape="round" color="primary">
                  <ion-label> siguiente</ion-label>
                  <ion-icon  name="arrow-forward"></ion-icon>
                </ion-chip>
        </div>
    </ng-template>
</p-stepperPanel>
<p-stepperPanel header="Fecha de entrega">
  <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback" let-index="index">
      <div class="flex flex-column h-12rem">
          <div class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
               Content II
              <app-fecha-pedido></app-fecha-pedido>
               <app-fecha-pedido></app-fecha-pedido>
           </div>
      </div>
      <div class="flex pt-4 justify-content-between">
              <ion-chip (click)="prevCallback.emit()" fill="solid" shape="round" color="dark">
                <ion-icon  name="arrow-back"></ion-icon>
                <ion-label>retroceder</ion-label>
              </ion-chip>
              <ion-chip (click)="nextCallback.emit()" fill="solid" shape="round" color="primary">
                <ion-label> siguiente</ion-label>
                <ion-icon  name="arrow-forward"></ion-icon>
              </ion-chip>
      </div>
  </ng-template>
</p-stepperPanel>
<p-stepperPanel header="Dirección de entrega">
  <ng-template pTemplate="content" let-prevCallback="prevCallback" let-nextCallback="nextCallback" let-index="index">
              <app-direccion-pedido></app-direccion-pedido>
      <div class="flex pt-4 justify-content-between">
              <ion-chip (click)="prevCallback.emit()" fill="solid" shape="round" color="dark">
                <ion-icon  name="arrow-back"></ion-icon>
                <ion-label>retroceder</ion-label>
              </ion-chip>
              <ion-chip (click)="nextCallback.emit()" fill="solid" shape="round" color="primary">
                <ion-label> siguiente</ion-label>
                <ion-icon  name="arrow-forward"></ion-icon>
              </ion-chip>
      </div>
  </ng-template>
</p-stepperPanel>
<p-stepperPanel header="Confirmación">
    <ng-template pTemplate="content" let-prevCallback="prevCallback" let-index="index">

      <ion-grid fixed>
        <ion-row class="ion-justify-content-center">
          <ion-col size="12" sizeMd="8">
              @if (infoPedido) {
                <ion-list inset>
                  <ion-item>
                    <ion-icon name="pricetag" slot="start" color="primary"></ion-icon>
                    <ion-label>
                      <ion-text color="primary">Total:</ion-text>
                      <p>{{carrito?.total | currency}}</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="person" slot="start" color="primary"></ion-icon>
                    <ion-label>
                      <ion-text color="primary">Datos:</ion-text>
                      <p>{{infoPedido.datos?.name}}</p>
                      <p>{{infoPedido.datos?.phone}}</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="calendar" slot="start" color="primary"></ion-icon>
                    <ion-label>
                      <ion-text color="primary"> Fecha de entrega: </ion-text>
                      <p>{{infoPedido.fechaEntrega | date:'dd-MM-yyyy'}}</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon name="location" slot="start" color="danger"></ion-icon>
                    <ion-label>
                      <ion-text color="primary">Dirección de entrega:</ion-text>
                      <p>{{infoPedido.direccionEntrega?.referencia}}</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              }
          </ion-col>
        </ion-row>
      </ion-grid>


        <div class="flex pt-4 justify-content-start">
          <ion-chip (click)="prevCallback.emit()" fill="solid" shape="round" color="dark">
            <ion-icon  name="arrow-back"></ion-icon>
            <ion-label>retroceder</ion-label>
          </ion-chip>
        </div>
        <br>

        <ion-grid>
          <ion-row class="ion-justify-content-end">
            <ion-col size="10" sizeMd="6" sizeXl="4">
              <ion-button shape="round" expand="block" color="success"
              (click)="pedir()">
                Pedir
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>

      </ng-template>
</p-stepperPanel>
</p-stepper>





</ion-content>

<ion-footer>
<ion-toolbar class="ion-text-end">
<ion-item lines="none">
  <ion-badge slot="end">{{carrito?.total | currency}}</ion-badge>
  <ion-label class="ion-text-end">
    <strong>Total:</strong>
  </ion-label>
</ion-item>
</ion-toolbar>
</ion-footer>-->
