import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { WorkListItemComponent } from './work-list-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [WorkListItemComponent],
  exports: [WorkListItemComponent],
})
export class WorkListItemModule {}
