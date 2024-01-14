import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from } from 'rxjs';

export enum ThemeSetting {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export enum CurrentTheme {
  Light = 'light',
  Dark = 'dark',
}

const THEME_LOCAL_STORAGE_KEY = 'preferredTheme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() { }

  async setPreference(theme: ThemeSetting) {
    await Preferences.set({
      key: THEME_LOCAL_STORAGE_KEY,
      value: theme.toString(),
    });
  }

  async getPreference(): Promise<ThemeSetting> {
    const storedValue = await Preferences.get({ key: THEME_LOCAL_STORAGE_KEY });

    // If there's nothing stored (first time access), store Auto
    if (storedValue.value == null) {
      const theme = ThemeSetting.Auto;
      await Preferences.set({
        key: THEME_LOCAL_STORAGE_KEY,
        value: theme.toString(),
      });
      return theme;
    }

    return storedValue.value as ThemeSetting;
  }

  async getCurrentTheme(): Promise<CurrentTheme> {
    const themeSetting = await this.getPreference();

    switch (themeSetting) {
      case ThemeSetting.Dark:
        return CurrentTheme.Dark;
      case ThemeSetting.Light:
        return CurrentTheme.Light;
      case ThemeSetting.Auto:
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        return prefersDark.matches ? CurrentTheme.Dark : CurrentTheme.Light;
    }
  }

  // Simple function to update the page theme with the current selected theme immediately
  //
  // This function is synchronous, but uses getCurrentTheme, converted into an observable,
  // to which the theme change logic is subscribed. This is done to make it easier to use
  // from constructor, or other synchronous methods.
  updatePageTheme() {
    const curTheme$ = from(this.getCurrentTheme());
    curTheme$.subscribe((theme) => {
      switch (theme) {
        case CurrentTheme.Light:
          document.body.setAttribute('color-theme', 'light');
          break;
        case CurrentTheme.Dark:
          document.body.setAttribute('color-theme', 'dark');
          break;
      }
    });
  }
}
