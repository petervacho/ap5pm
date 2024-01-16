import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditionDetailPageRoutingModule } from './edition-routing.module';

import { EditionPage } from './edition.page';
import { WorkRatingItemModule } from 'src/app/components/work-rating-item/work-rating-item.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditionDetailPageRoutingModule,
    WorkRatingItemModule,
  ],
  declarations: [EditionPage],
})
export class EditionDetailPageModule {}
