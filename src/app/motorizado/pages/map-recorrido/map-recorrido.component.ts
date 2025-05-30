
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { GoogleMap, Marker, LatLngBounds } from '@capacitor/google-maps';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle,
  IonToolbar, MenuController, IonItem,  IonLabel, IonIcon, IonButton,  ModalController,  IonFab,  IonFabButton,  IonFabList,  IonFooter,  IonSelect,  IonSelectOption} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { InteractionService } from '../../../services/interaction.service';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/firebase/firestore.service';
import { Subscription } from 'rxjs';
import { Models } from 'src/app/models/models';
import { PlaceDetailComponent } from 'src/app/store/components/place-detail/place-detail.component';
import { AuthenticationService } from 'src/app/firebase/authentication.service';
import { User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';


const apiKey = environment.firebaseConfig.apiKey;

@Component({
  selector: 'app-map-recorrido',
  templateUrl: './map-recorrido.component.html',
  styleUrls: ['./map-recorrido.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonBackButton, IonTitle,
    IonContent, IonButtons,
    IonItem, IonLabel,
    IonIcon, IonButton,
    CommonModule,
    IonFab, IonFabButton, IonFabList,
    IonFooter,
    IonSelect, IonSelectOption, FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapRecorridoComponent implements OnInit {

  map: GoogleMap;
  transparency: boolean = false;
  myLocation: Place;
  estados = Models.Tienda.StepsPedidoMotorizado;

  private interactionService: InteractionService = inject(InteractionService)
  private firestoreService: FirestoreService = inject(FirestoreService);
  private authenticationService: AuthenticationService = inject(AuthenticationService);

  suscriberPedido: Subscription;
  pedido: Models.Tienda.Pedido;

  local: Place;
  home: Place;

  idWatcher: string;
  user: User;

  constructor(private menuController: MenuController,
              private modalController: ModalController,
              private route: ActivatedRoute) {
                this.user = this.authenticationService.getCurrentUser();
              }

  ionViewDidEnter() {
    this.menuController.enable(false, 'main');
    this.transparency = true;
    this.initMap();
  }

  ionViewDidLeave() {
    this.menuController.enable(true, 'main');
    this.transparency = false;
    this.map?.destroy();
    this.suscriberPedido?.unsubscribe();
    Geolocation.clearWatch({id: this.idWatcher});
  }

  ngOnInit() {
  }

  async initMap() {

    this.map = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: document.getElementById('map'), // reference to the capacitor-google-map element
      apiKey: apiKey, // Your Google Maps API Key
      language: 'es',
      config: {
        disableDefaultUI: true,
        // draggable: false,
        center: {
          // The initial position to be rendered by the map
          lat: -33.0051882,
          lng: -58.5132492
        },
        // tilt: 45,

        zoom: 15, // The initial zoom level to be rendered by the map
      },
    });

    if (Capacitor.isNativePlatform()) {
       this.map.enableCurrentLocation(true);
    }
    this.getQueryParams();
  }

  getQueryParams() {
    const queryParams = this.route.snapshot.queryParams as any;
    console.log('queryParams -> ', queryParams);
    if (queryParams.user && queryParams.id) {
      this.loadPedido(queryParams.user, queryParams.id);
      this.addListeners();
      this.setUbicacionLocal();
      this.initTraking();
       this.initTrakingDemo() //prueba del mapa
    }

  }

  loadPedido(idUser: string, idPedido: string) {
    const path = `${Models.Auth.PathUsers}/${idUser}/${Models.Tienda.pathPedidos}/${idPedido}`;
    this.suscriberPedido = this.firestoreService.getDocumentChanges<Models.Tienda.Pedido>(path).subscribe( res => {
      if (res) {
        this.pedido = res;
        console.log('pedido changes -> ', this.pedido);
        this.setUbicacionCliente();
        if (this.pedido.motorizado?.coordinate) {
          this.setMarkerMyPosition(this.pedido.motorizado?.coordinate.lat, this.pedido.motorizado?.coordinate.lng)
        }
      }
    });
  }

  async setUbicacionCliente() {
    if (!this.home) {
      const place: Place = {
          name: 'Ubicación del cliente',
          description: this.pedido.info.direccionEntrega.referencia,
          marker: {
            title: 'Ubicación del cliente',
            snippet: this.pedido.info.direccionEntrega.referencia,
            iconUrl: 'assets/icons/home.png',
            iconSize: {
              width: 35,
              height: 35
            },
            coordinate: {
              lat: this.pedido.info.direccionEntrega.coordinate.lat,
              lng: this.pedido.info.direccionEntrega.coordinate.lng
            }
          },
      }
      const marker: Marker = {
        coordinate: {
          lat: this.pedido.info.direccionEntrega.coordinate.lat,
          lng: this.pedido.info.direccionEntrega.coordinate.lng
        }
      }
      const id = await this.map.addMarker(place.marker);
      place.id = id;
      this.home = place;
    }
  }

  async setUbicacionLocal() {
   const place = local;
   const id = await this.map.addMarker(place.marker);
   place.id = id;
   this.local = place;
  }

  async initTraking() {
    await this.interactionService.showLoading('obteniendo tu ubicación...')
    const check = await Geolocation.checkPermissions();
    console.log('checkPermissions -> ', check);
    if (check.location != 'granted') {
      // solicitar permisos
      if (check.location == 'denied') {
        // no tenemos permisos
        this.interactionService.dismissLoading();
        return;
      }
      if (Capacitor.isNativePlatform()) {
        const response = await Geolocation.requestPermissions({permissions: ['coarseLocation']});
        console.log('requestPermissions response -> ', response);
        if (response.location != 'granted') {
          this.interactionService.dismissLoading();
          return;
        }
      }
    }
    // si tenemos permisos
    console.log('obteniendo posición');
    this.idWatcher = await Geolocation.watchPosition({enableHighAccuracy: true}, location => {
        console.log('watcher position -> ', location);
        this.interactionService.dismissLoading();
        this.updateLocation(location.coords.latitude, location.coords.longitude)
        // this.setMarkerMyPosition(location.coords.latitude, location.coords.longitude)
    });
  }

  async updateLocation(lat: number, lng: number) {
    const path = `${Models.Auth.PathUsers}/${this.pedido.uid}/${Models.Tienda.pathPedidos}/${this.pedido.id}`;
    const updateData: any = {
      motorizado: {
        uid: this.user.uid,
        name: this.user.displayName,
        coordinate: {
          lat,
          lng
        }
      }
    }
    await this.firestoreService.updateDocument(path, updateData);
  }

  addListeners() {

    this.map.setOnMarkerClickListener( marker => {
      console.log('MarkerClickListener -> ', marker);
      if (marker.markerId == this.home.id) {
        this.showDetailMarker(this.home)
      }
      if (marker.markerId == this.local.id) {
        this.showDetailMarker(this.local)
      }
    });

  }

  async showDetailMarker(place: Place) {
    const modal = await this.modalController.create({
      component: PlaceDetailComponent,
      componentProps: { place },
      initialBreakpoint: 0.25,
      breakpoints: [0, 0.25]
    });

    await modal.present();
     const {data} = await modal.onWillDismiss();
     if (data) {
       const place = data.place as Place
       console.log('dismiss modal -> ', data);
       //this.carritoService.setCoordenadasPedido(place.marker.coordinate);
       //this.router.navigate(['/store/carrito'])
     }
  }

 async setMarkerMyPosition(latitude: number, longitude: number) {
    if (this.myLocation?.id) {
      this.map.removeMarker(this.myLocation.id)
    }
    this.myLocation = {
      name: 'Motorizado',
      description: 'Ubicación en tiempo real',
      marker: {
        title: 'Motorizado',
        snippet: 'Ubicación en tiempo real',
        draggable: false,
        iconUrl: 'assets/icons/moto.png',
        iconSize: {
          width: 45,
          height: 45
        },
        iconAnchor: {
          x: 22.5, y: 22.5
        },
        coordinate: {
          lat: latitude,
          lng: longitude,
        }
      }
    }
    const id = await this.map.addMarker(this.myLocation.marker);
    this.myLocation.id = id;
    // this.centerMarkerWithBounds(this.myLocation.marker);
  }

  centerMarkerWithBounds(marker: Marker) {
    console.log('centerMarkerWithBounds');
    // desplazamiento
    const des: number = 0.001;
    const northeast = {
      lat: marker.coordinate.lat + des,
      lng: marker.coordinate.lng + des
    }
    const southwest = {
      lat: marker.coordinate.lat - des,
      lng: marker.coordinate.lng - des
    }
    let bounds = new LatLngBounds({
      southwest: southwest,
      center: marker.coordinate,
      northeast: northeast,
    })
    this.map.fitBounds(bounds, 100)


  }

  centerTwoMarkerWithBounds(marker1: Marker, marker2: Marker) {
    const northeast = {
      lat: marker1.coordinate.lat > marker2.coordinate.lat ?
              marker1.coordinate.lat : marker2.coordinate.lat,
      lng:  marker1.coordinate.lng > marker2.coordinate.lng ?
        marker1.coordinate.lng : marker2.coordinate.lng
    }
    const southwest = {
      lat: marker1.coordinate.lat < marker2.coordinate.lat ?
              marker1.coordinate.lat : marker2.coordinate.lat,
      lng:  marker1.coordinate.lng < marker2.coordinate.lng ?
        marker1.coordinate.lng : marker2.coordinate.lng
    }

    const center = {
      lat: southwest.lat + (northeast.lat - southwest.lat) / 2,
      lng: southwest.lng + (northeast.lng - southwest.lng) / 2,
    }

    let bounds = new LatLngBounds({
      southwest: southwest,
      center: center,
      northeast: northeast,
    })
    this.map.fitBounds(bounds, 30)
  }

  centerMarker(marker: Marker) {
    console.log('centerMarker');
    this.map.setCamera({
        coordinate: marker.coordinate,
        zoom: 16,
    })

  }

  centerPlace(name: 'home' | 'local' | 'moto' | 'moto-home') {
    if (name == 'home') {
        this.centerMarkerWithBounds(this.home.marker)
    }
    if (name == 'moto') {
      this.centerMarkerWithBounds(this.myLocation.marker)
    }
    if (name == 'local') {
      this.centerMarkerWithBounds(this.local.marker)
    }
    if (name == 'moto-home') {
      this.centerTwoMarkerWithBounds(this.myLocation.marker, this.home.marker)
    }

  }


  initTrakingDemo() {
    this.map.setOnMapClickListener( res => {
         this.setMarkerMyPosition(res.latitude, res.longitude)
        this.updateLocation(res.latitude, res.longitude)
    })
  }

  async changeState() {
    console.log('changeState -> ', this.pedido.state);
    await this.interactionService.showLoading('Actualizando estado...');
    try {
      const path = `${Models.Auth.PathUsers}/${this.pedido.info.datos.id}/${Models.Tienda.pathPedidos}/${this.pedido.id}`;
      const updateData = {
        state: this.pedido.state
      }
      // crear regla de actualización
      await this.firestoreService.updateDocument(path, updateData);
      this.interactionService.dismissLoading();
    } catch (error) {
      console.error(error);
      this.interactionService.presentAlert('Error', 'No se pudo actualizar el estado');
      this.interactionService.dismissLoading();
    }

  }


}

const local: Place = {
    name: 'Ubicación del local',
    description: 'Calle 1 y Av 12',
    marker: {
      title: 'Ubicación del local',
      snippet: 'Calle 1 y Av 12',
      iconUrl: 'assets/icons/restaurante.png',
      iconSize: {
        width: 35,
        height: 35
      },
      coordinate: {
        lat: -33.0052682,
        lng: -58.5133192
      }
    }
}

interface Place {
  id?: string;
  name: string;
  description: string;
  marker: Marker;
}

