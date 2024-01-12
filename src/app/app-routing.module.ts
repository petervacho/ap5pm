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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
