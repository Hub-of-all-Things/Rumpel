import { provideRouter, RouterConfig } from '@angular/router';

import { GridComponent } from './dashboard';
import { AuthComponent } from './auth';
import { LocationsComponent, CalendarComponent, PhotosComponent, SocialComponent, MixpadComponent } from './dataViews';

export const routes: RouterConfig = [
  { path: '', component: GridComponent },
  { path: 'authenticate/:jwt', component: AuthComponent },
  { path: 'social', component: SocialComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'photos', component: PhotosComponent },
  { path: 'mixpad', component: MixpadComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];