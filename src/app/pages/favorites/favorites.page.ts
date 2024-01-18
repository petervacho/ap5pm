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
  private favoriteEditionIds$!: Observable<string[]>;

  // Pagination
  private curIndex: number = 0;
  private fetchSize: number = 20;
  private keepFetcing: boolean = false;
  private fetchedEditionsSubject = new BehaviorSubject<EditionModel[]>([]);
  fetchedEditions$: Observable<EditionModel[]> =
    this.fetchedEditionsSubject.asObservable();
  protected eventTarget: HTMLIonInfiniteScrollElement | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private openLibraryApiService: OpenlibraryApiService
  ) { }

  ngOnInit() { }

  /** This method will automatically get triggered once the page is shown/entered.
   *
   * This is different to the page loading, as this page may have just been "paused",
   * by the user being in another tab, from which they've added another favorite item
   * For that reason, we'll need to reload the list of those here.
   *
   * That said, this function will still run also on the page load, not just on re-enter.
   * That means this will also perform the initial load.
   */
  ionViewWillEnter() {
    this.favoriteEditionIds$ = from(this.favoritesService.getFavorites()).pipe(
      map((x) => Array.from(x))
    );

    this.favoriteEditionIds$.subscribe(() => {
      this.fetchedEditionsSubject.next([]);
      this.curIndex = 0;
      this.keepFetcing = true;
      if (this.eventTarget != null) {
        this.eventTarget.disabled = false;
      }
      this.loadEditions();
    });
  }

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
      Math.min(this.curIndex + this.fetchSize, editionIds.length)
    );

    this.curIndex += this.fetchSize;

    // Await all of the API call results at once
    const promises = toFetch.map((id) =>
      firstValueFrom(this.openLibraryApiService.get_edition$(id))
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

    // Store the event's target, so that we can re-enable it if needed
    if (this.eventTarget == null) {
      this.eventTarget = event.target;
    }
  }
}
