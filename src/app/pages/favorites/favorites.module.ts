import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritesPageRoutingModule } from './favorites-routing.module';

import { FavoritesPage } from './favorites.page';
import { EditionListItemModule } from 'src/app/components/edition-list-item/edition-list-item.module';
import { SettingsButtonModule } from 'src/app/components/settings-button/settings-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageRoutingModule,
    EditionListItemModule,
    SettingsButtonModule,
  ],
  declarations: [FavoritesPage],
})
export class FavoritesPageModule { }
