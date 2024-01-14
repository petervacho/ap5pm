import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const FAVORITES_LOCAL_STORAGE_KEY = 'favorites';

// NOTE: The current logic is fairly inefficient, since whenever favorites are changed,
// the whole thing gets written back into local storage, converting the hash-set to list.
// That means we lose the benefits of the hash-set efficiency, as we're constructing it
// from a list, and then deconstructing it again.
// The only benefit to using the hash-set here is the convenience methods it has.
// It's not a huge issue though, as we don't expect favorites to contain millions of items.

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  constructor() { }

  async getFavorites(): Promise<Set<string>> {
    const storedValue = await Preferences.get({
      key: FAVORITES_LOCAL_STORAGE_KEY,
    });

    // If there's nothing stored (first time access), store empty list
    if (storedValue.value == null) {
      const initValue: Set<string> = new Set([]);
      this.setFavorites(initValue);
      return initValue;
    }

    return new Set(JSON.parse(storedValue.value) as string[]);
  }

  async setFavorites(value: Set<string>) {
    await Preferences.set({
      key: FAVORITES_LOCAL_STORAGE_KEY,
      value: JSON.stringify(Array.from(value)),
    });
  }

  async addFavorite(edition_id: string): Promise<boolean> {
    const favorites = await this.getFavorites();

    // This edition is already present
    if (favorites.has(edition_id)) {
      return false;
    }

    favorites.add(edition_id);
    await this.setFavorites(favorites);
    return true;
  }

  async removeFavorite(edition_id: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const existed = favorites.delete(edition_id);
    await this.setFavorites(favorites);
    return existed;
  }

  async isFavorite(edition_id: string) {
    const favorites = await this.getFavorites();
    return favorites.has(edition_id);
  }
}
