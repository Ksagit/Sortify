import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Sortify - Landing Page',
    component: LandingPageComponent,
  },
  {
    path: 'Dashboard',
    title: 'Sortify - Dashboard',
    component: DashboardComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
