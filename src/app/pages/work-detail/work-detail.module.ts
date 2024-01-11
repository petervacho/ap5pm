import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkDetailPageRoutingModule } from './work-detail-routing.module';

import { WorkDetailPage } from './work-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkDetailPageRoutingModule
  ],
  declarations: [WorkDetailPage]
})
export class WorkDetailPageModule {}
