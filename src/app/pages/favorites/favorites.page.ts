import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, from, map } from 'rxjs';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { FavoritesService } from 'src/app/services/favorites/favorites.service';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';

// TODO: This needs re-working, either with just a custom paginator,
// or with a completely different logic (perhaps make favorites into
// sort of a "already read" list, allowing us to show the total amount
// of pages read, and things like that).

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  private favoriteEditionIds$: Observable<string[]>;

  // Pagination
  private curIndex: number = 0;
  private fetchSize: number = 20;
  private keepFetcing: boolean = true;
  private fetchedEditionsSubject = new BehaviorSubject<EditionModel[]>([]);
  fetchedEditions$: Observable<EditionModel[]> =
    this.fetchedEditionsSubject.asObservable();

  constructor(
    private favoritesService: FavoritesService,
    private openLibraryApiService: OpenlibraryApiService,
  ) {
    this.favoriteEditionIds$ = from(favoritesService.getFavorites()).pipe(
      map((item) => Array.from(item)),
    );

    // Perform the initial (ion-infinite-scroll won't trigger it on it's own)
    this.loadEditions();
  }

  ngOnInit() { }

  private async loadEditions() {
    if (this.keepFetcing == false) {
      return;
    }

    const editionIds = await firstValueFrom(this.favoriteEditionIds$);

    if (this.curIndex + this.fetchSize >= editionIds.length) {
      this.keepFetcing = false;
    }

    const toFetch = editionIds.slice(
      this.curIndex,
      Math.min(this.curIndex + this.fetchSize, editionIds.length),
    );

    this.curIndex += this.fetchSize;

    // Await all of the API call results at once
    const promises = toFetch.map((id) =>
      firstValueFrom(this.openLibraryApiService.get_edition$(id)),
    );
    const results = await Promise.all(promises);

    this.fetchedEditionsSubject.next([
      ...this.fetchedEditionsSubject.value,
      ...results,
    ]);
  }

  async loadData(event: any) {
    // We need this to be blocking, so that `ion-infinite-scroll` can
    // properly show the loading icon (since the API can be pretty slow)
    await this.loadEditions();
    event.target.complete();

    // Check if all editions are loaded
    if (this.keepFetcing == false) {
      event.target.disabled = true;
    }
  }
}
