import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { ResourcesComponent } from './pages/resources/resources';
import { Home } from './home/home';
import { Snippets } from './pages/snippets/snippets';
import { Reference } from './reference/reference';

export const routes: Routes = [

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: Home
  },

  {
    path: 'snippets',
    component: Snippets
  },

  { path: 'resources', 
    component: ResourcesComponent },

  {
    path: 'reference',
    component: Reference
  },
];
