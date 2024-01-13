import { Injectable } from '@angular/core';

// Class used to allow for simple state/data sharing between controllers.
// This is mainly intended to be used when sharing a substantial amount of data
// which wouldn't make sense to just pass over via query params / as part of path.
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private dataStore: { [key: string]: any } = {};

  setData<T>(key: string, data: T): void {
    this.dataStore[key] = data;
  }

  getData<T>(key: string): T | null {
    return key in this.dataStore ? (this.dataStore[key] as T) : null;
  }
}
