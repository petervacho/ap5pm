import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { WorkSearchPage } from './work-search.page';

import { WorkSearchPageRoutingModule } from './work-search-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkSearchPageRoutingModule,
  ],
  declarations: [WorkSearchPage],
})
export class WorkSearchPageModule { }
