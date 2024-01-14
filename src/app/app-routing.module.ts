import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'work-search',
    pathMatch: 'full',
  },
  {
    path: 'work-search',
    loadChildren: () =>
      import('./pages/work-search/work-search.module').then(
        (m) => m.WorkSearchPageModule,
      ),
  },
  {
    path: 'edition-list/:work_id',
    loadChildren: () =>
      import('./pages/edition-list/edition-list.module').then(
        (m) => m.EditionListPageModule,
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
