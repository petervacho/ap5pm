import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from } from 'rxjs';

/** Enumeration for the configured theme, as set by user. */
export enum ThemeSetting {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

/** Enumeration for the theme to be used/which is currently being used. */
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

  /** Set/override the user's preferred theme (in local storage) */
  async setPreference(theme: ThemeSetting) {
    await Preferences.set({
      key: THEME_LOCAL_STORAGE_KEY,
      value: theme.toString(),
    });
  }

  /** Get the user's preferred theme (from local storage).
   *
   * If there's no stored preference yet, the Auto option is set.
   * */
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

  /** Get the theme which should be shown, depending on the user's stored preference. */
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

  /** Update the currently loaded page, with the currently selected theme.
   *
   * The theme to change to is determined using `getCurrentTheme`.
   *
   * This function is synchronous, converting the result of `getCurrentTheme`, into an observable,
   * to which the theme change logic is subscribed. This is done o make it easier to use this
   * function from a constructor, or other synchronous methods.
   */
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
