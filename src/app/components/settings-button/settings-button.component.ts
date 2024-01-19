import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsPage } from 'src/app/pages/settings/settings.page';

@Component({
  selector: 'app-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
})
export class SettingsButtonComponent implements OnInit {
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  /** Called when the user clicks on the settings icon. */
  async openSettings() {
    const modal = await this.modalCtrl.create({ component: SettingsPage });
    await modal.present();
  }
}
