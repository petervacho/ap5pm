import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import {
  ThemeService,
  ThemeSetting,
} from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currentThemeSetting: 'auto' | 'dark' | 'light' = 'auto';

  constructor(
    private modalCtrl: ModalController,
    private themeService: ThemeService,
  ) {
    const currentThemeSetting$ = from(themeService.getPreference());
    currentThemeSetting$.subscribe(
      (theme) => (this.currentThemeSetting = theme),
    );
  }

  ngOnInit() { }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  async onThemeChange(event: any) {
    const selectedTheme: 'auto' | 'dark' | 'light' = event.detail.value;
    const themeSetting = selectedTheme as ThemeSetting;

    const currentTheme = await this.themeService.getCurrentTheme();
    await this.themeService.setPreference(themeSetting);
    const newTheme = await this.themeService.getCurrentTheme();

    if (currentTheme != newTheme) {
      this.themeService.updatePageTheme();
    }
  }
}
