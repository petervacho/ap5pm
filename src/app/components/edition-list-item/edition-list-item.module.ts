import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditionListItemComponent } from './edition-list-item.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [EditionListItemComponent],
  exports: [EditionListItemComponent],
})
export class EditionListItemModule {}
