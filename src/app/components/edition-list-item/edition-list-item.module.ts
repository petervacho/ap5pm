import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditionListItemComponent } from './edition-list-item.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LazyImgModule } from '../lazy-img/lazy-img.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LazyImgModule],
  declarations: [EditionListItemComponent],
  exports: [EditionListItemComponent],
})
export class EditionListItemModule { }
