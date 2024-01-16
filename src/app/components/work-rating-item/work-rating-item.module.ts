import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { WorkRatingItemComponent } from './work-rating-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [WorkRatingItemComponent],
  exports: [WorkRatingItemComponent],
})
export class WorkRatingItemModule {}
