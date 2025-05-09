import { Routes } from '@angular/router';
import { guards } from './shared/guards/guards';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'user',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.module').then((m) => m.BackofficeModule),
    canActivate: [guards.isRolClaim(['admin'])]
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.module').then((m) => m.StoreModule),

  },
  {
    path: 'motorizado',
    loadChildren: () => import('./motorizado/motorizado.module').then((m) => m.MotorizadoModule),
    canActivate: [guards.isRolClaim(['motorizado'])]

  },
  {
    path: '',
    loadChildren: () => import('./store/store.module').then((m) => m.StoreModule),

  },
  {
    path: '**',
    redirectTo: 'store',
    pathMatch: 'full',
  },
];
