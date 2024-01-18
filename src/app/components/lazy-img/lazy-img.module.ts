import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LazyImgComponent } from './lazy-img.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [LazyImgComponent],
  exports: [LazyImgComponent],
})
export class LazyImgModule { }
