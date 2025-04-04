import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.prod';

// firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, initializeFirestore, persistentLocalCache, provideFirestore } from '@angular/fire/firestore';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ScreenTrackingService, getAnalytics, provideAnalytics, UserTrackingService } from '@angular/fire/analytics';
import { Capacitor } from '@capacitor/core';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({innerHTMLTemplatesEnabled: true}),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // firebase
     provideFirebaseApp(() => {
      const app = initializeApp(environment.firebaseConfig); //inicializa la aplicacion
      if (Capacitor.isNativePlatform()) {
        initializeFirestore(app, {
          localCache: persistentLocalCache(),
        });
        initializeAuth(app, {
          persistence: indexedDBLocalPersistence
        });
      }
      return app;
    }),
    provideFirestore(() => getFirestore()), //obtener el mmódulo de firestore
    provideAuth(() => getAuth()), //obtener el modulo de autenticación
    provideFunctions(() => getFunctions()), //obtener el modulo de funciones
    provideStorage(() => getStorage()), //obtener el modulo de almacenamiento
    provideAnalytics(() => getAnalytics() ),
    ScreenTrackingService,
    UserTrackingService,

  ],
});




