import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  // Routes shown in the tabs
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/favorites',
        pathMatch: 'full',
      },
      {
        path: 'favorites',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/favorites/favorites.module').then(
                (m) => m.FavoritesPageModule,
              ),
          },
          {
            path: 'edition/:edition_id',
            loadChildren: () =>
              import('../pages/edition/edition.module').then(
                (m) => m.EditionDetailPageModule,
              ),
          },
        ],
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/search/search.module').then(
                (m) => m.SearchPageModule,
              ),
          },
          {
            path: 'work/:work_id',
            loadChildren: () =>
              import('../pages/work/work.module').then((m) => m.WorkPageModule),
          },
          {
            path: 'edition/:edition_id',
            loadChildren: () =>
              import('../pages/edition/edition.module').then(
                (m) => m.EditionDetailPageModule,
              ),
          },
        ],
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/favorites',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
