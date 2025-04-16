/*import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Models } from 'src/app/models/models';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { IonContent, IonHeader, IonChip, IonItem } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrito-page',
  templateUrl: './carrito-page.component.html',
  styleUrls: ['./carrito-page.component.scss'],
  standalone: false,
})
export class CarritoPageComponent  implements OnInit {

  private carritoService: CarritoService = inject(CarritoService);
  carrito: Models.Tienda.Carrito;
  suscriberCarrito: Subscription;

  //infoPedido: Models.Tienda.InfoPedido;


  constructor() {
    this.loadCarrito();
    //this.loadInfoPedido();
  }

  ngOnInit() {}

  loadCarrito() {
    this.carrito = this.carritoService.getCarrito();
    this.carritoService.getCarritoChanges().subscribe( res => {
      this.carrito = res;
    });
  }

  /*loadInfoPedido() {
    this.infoPedido = this.carritoService.getInfoPedido();
    this.carritoService.getInfoPedidoChanges().subscribe( res => {
      this.infoPedido = res;
      console.log('infoPedido in carrito-page -> ', this.infoPedido);
    });
  }

  pedir() {
    console.log('pedir infoPedido -> ', this.infoPedido);
    this.carritoService.pedir();
  }*/

    import { Component, OnInit, inject } from '@angular/core';
    import { CarritoService } from '../../services/carrito.service';
    import { Models } from 'src/app/models/models';
    import { Subscription } from 'rxjs';

    @Component({
      selector: 'app-carrito-page',
      templateUrl: './carrito-page.component.html',
      styleUrls: ['./carrito-page.component.scss'],
      standalone: false,
    })
    export class CarritoPageComponent implements OnInit {

      private carritoService: CarritoService = inject(CarritoService);
      carrito: Models.Tienda.Carrito;
      suscriberCarrito: Subscription;

      currentStep = 1; // 👈 NUEVO: control del paso actual
      //infoPedido: Models.Tienda.InfoPedido;

      constructor() {
        this.loadCarrito();
        //this.loadInfoPedido();
      }

      ngOnInit() {}

      loadCarrito() {
        this.carrito = this.carritoService.getCarrito();
        this.suscriberCarrito = this.carritoService.getCarritoChanges().subscribe(res => {
          this.carrito = res;
        });
      }

      // 👇 NUEVO: Función para ir al siguiente paso
      nextStep() {
        if (this.currentStep < 5) {
          this.currentStep++;
        }
      }

      // 👇 NUEVO: Función para ir al paso anterior
      prevStep() {
        if (this.currentStep > 1) {
          this.currentStep--;
        }
      }

      // 👇 NUEVO: Ir directamente a un paso (opcional)
      goToStep(step: number) {
        this.currentStep = step;
      }

      /*loadInfoPedido() {
        this.infoPedido = this.carritoService.getInfoPedido();
        this.carritoService.getInfoPedidoChanges().subscribe( res => {
          this.infoPedido = res;
          console.log('infoPedido in carrito-page -> ', this.infoPedido);
        });
      }

      pedir() {
        console.log('pedir infoPedido -> ', this.infoPedido);
        this.carritoService.pedir();
      }*/

      }

