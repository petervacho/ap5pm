import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditionDetailPageRoutingModule } from './edition-routing.module';

import { EditionPage } from './edition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditionDetailPageRoutingModule
  ],
  declarations: [EditionPage]
})
export class EditionDetailPageModule {}
