import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkPageRoutingModule } from './work-routing.module';

import { WorkPage } from './work.page';
import { EditionListItemComponent } from 'src/app/components/edition-list-item/edition-list-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, WorkPageRoutingModule],
  declarations: [WorkPage, EditionListItemComponent],
})
export class WorkPageModule { }
