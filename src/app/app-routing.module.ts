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
    path: 'workDetail',
    loadChildren: () =>
      import('./pages/work-detail/work-detail.module').then(
        (m) => m.WorkDetailPageModule,
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
