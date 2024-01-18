import { Injectable } from '@angular/core';

/** Class used to allow for a simple state/data sharing between controllers.
 *
 * This is mainly intended to be used when sharing a substantial amount of data,
 * which wouldn't make sense to just pass over via query params / as a part of path.
 */
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private dataStore: { [key: string]: any } = {};

  /** Set a value for given key.
   *
   * If this key already exists, it's value will be overwritten.
   */
  setData<T>(key: string, data: T): void {
    this.dataStore[key] = data;
  }

  /** Obtain the value for given key.
   *
   * If this key isn't set, null will be returned instead.
   */
  getData<T>(key: string): T | null {
    return key in this.dataStore ? (this.dataStore[key] as T) : null;
  }

  /** Remove given key (and the value it holds). */
  popData<T>(key: string): T | null {
    if (key in this.dataStore) {
      const temp = this.dataStore[key];
      delete this.dataStore[key];
      return temp;
    }
    return null;
  }
}
