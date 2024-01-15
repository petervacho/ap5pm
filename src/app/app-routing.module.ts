import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./pages/search/search.module').then(
        (m) => m.SearchPageModule,
      ),
  },
  {
    path: 'work/:work_id',
    loadChildren: () =>
      import('./pages/work/work.module').then(
        (m) => m.WorkPageModule,
      ),
  },
  {
    path: 'edition-detail/:edition_id',
    loadChildren: () =>
      import('./pages/edition-detail/edition-detail.module').then(
        (m) => m.EditionDetailPageModule,
      ),
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
