import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditionDetailPage } from './edition-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EditionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditionDetailPageRoutingModule {}
