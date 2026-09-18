import { Routes } from '@angular/router';
import { ResourcesComponent } from './pages/resources/resources';
import { Home } from './home/home';
import { Snippets } from './pages/snippets/snippets';

export const routes: Routes = [

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
];
