import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditionListPageRoutingModule } from './edition-list-routing.module';

import { EditionListPage } from './edition-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditionListPageRoutingModule
  ],
  declarations: [EditionListPage]
})
export class EditionListPageModule {}
