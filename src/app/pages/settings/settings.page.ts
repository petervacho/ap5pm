import { Component, OnInit } from '@angular/core';
import { ModalController, RadioGroupCustomEvent } from '@ionic/angular';
import { from } from 'rxjs';
import { FavoritesService } from 'src/app/services/favorites/favorites.service';
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
    private favoritesService: FavoritesService,
  ) {
    const currentThemeSetting$ = from(themeService.getPreference());
    currentThemeSetting$.subscribe(
      (theme) => (this.currentThemeSetting = theme),
    );
  }

  ngOnInit() { }

  /** Called when user dismisses (closes) the settings modal */
  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  /** Called whenever the user clicks on one of the theme selection options. */
  async onThemeChange(event: RadioGroupCustomEvent<'auto' | 'dark' | 'light'>) {
    const selectedTheme = event.detail.value;
    const themeSetting = selectedTheme as ThemeSetting;

    const currentTheme = await this.themeService.getCurrentTheme();
    await this.themeService.setPreference(themeSetting);
    const newTheme = await this.themeService.getCurrentTheme();

    if (currentTheme != newTheme) {
      this.themeService.updatePageTheme();
    }
  }

  /** Called when the user clicks on the clear favorites button. */
  async clearFavorites() {
    await this.favoritesService.setFavorites(new Set([]));
  }
}
