import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './search.page';

import { SearchPageRoutingModule } from './search-routing.module';
import { WorkListItemComponent } from 'src/app/components/work-list-item/work-list-item.component';
import { SettingsButtonModule } from 'src/app/components/settings-button/settings-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    SettingsButtonModule,
  ],
  declarations: [SearchPage, WorkListItemComponent],
})
export class SearchPageModule { }
