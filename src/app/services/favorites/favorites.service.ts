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
  /** Use to allow apps to check whether there was an update to favorites
   * since the last time they checked.
   */
  lastUpdate: Date | null = null;

  constructor() { }

  /** Obtain all user's favorite editions from the local storage. */
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

  /** Set a new list of editions as user's favorites in the local storage. */
  async setFavorites(value: Set<string>) {
    await Preferences.set({
      key: FAVORITES_LOCAL_STORAGE_KEY,
      value: JSON.stringify(Array.from(value)),
    });

    this.lastUpdate = new Date();
  }

  /** Add a single new edition (id) to user's favorites (updating local storage). */
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

  /** Remove a single edition (id) from user's favorites (updating local storage). */
  async removeFavorite(editionId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const existed = favorites.delete(editionId);
    await this.setFavorites(favorites);
    return existed;
  }

  /** Check if the given edition (id) is marked favorite by the user. */
  async isFavorite(editionId: string) {
    // NOTE: This could probably have been made more efficient with a cache,
    // which only updates from setFavorites, which would even allow it to
    // be synchronous. However, I'm not too concerned with the performance here.
    const favorites = await this.getFavorites();
    return favorites.has(editionId);
  }
}
