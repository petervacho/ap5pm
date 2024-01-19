import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SettingsButtonComponent } from './settings-button.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [SettingsButtonComponent],
  exports: [SettingsButtonComponent],
})
export class SettingsButtonModule { }
