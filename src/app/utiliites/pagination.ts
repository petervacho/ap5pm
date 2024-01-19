import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { OpenlibraryApiService } from '../services/openlibrary-api/openlibrary-api.service';
import { SearchDataModel } from '../models/custom/search.model';
import { FavoritesService } from '../services/favorites/favorites.service';

abstract class BasePaginator<ItemT> {
  protected subject = new BehaviorSubject<ItemT[]>([]);
  items$: Observable<ItemT[]> = this.subject.asObservable();

  protected curIndex: number;
  protected keepFetching: boolean = true;

  constructor(startOffset: number = 0) {
    this.curIndex = startOffset;
  }

  /** Obtain the items for the next batch (page).
   *
   * This function is also responsible for incrementing `curIndex` and
   * for setting `keepFetching = true` once all available data was fetched.
   */
  abstract getNext(): Promise<ItemT[]>;

  /** Load the next batch (page).
   *
   * This will update the `items$`, extending it with the newly obtained items
   * (but it will still also include the previous ones).
   *
   * Note that this method should be called immediately after creating the paginator
   * to fetch first few records, to provide some initial data, which is necessary if
   * using the infiniteScrollEvent, because `ion-infinite-scroll` won't trigger it,
   * it only triggers once we scrolled to the bottom of the page, however if there's
   * no records shown, the user won't be able to scroll down.
   */
  async loadNext(): Promise<void> {
    if (this.keepFetching == false) {
      return;
    }

    const data = await this.getNext();
    this.subject.next([...this.subject.value, ...data]);
  }

  /** Function called when the keepFetching variable is false after
   * loading the batch, indicating that there's no more results to load.
   *
   * This should disable the ionic scroll event.
   *
   * NOTE: Subclasses should override this, and skip the event disabling
   * behavior if the class supports any kind of "restarting", since once
   * the ionic scroll event is disabled, it's not possible to re-enable it.
   * (Which is pretty weird, but after a lot of experimentation, it just
   * didn't seem to work.)
   */
  protected async disableEvent(
    event: InfiniteScrollCustomEvent
  ): Promise<void> {
    event.target.disabled = true;
  }

  /**
   * Handler function for `ion-infinite-scroll` element.
   *
   * Usage:
   * ```html
   * <ion-infinite-scroll (ionInfinite)="service.infiniteScrollEvent($event)">
   * </ion-infinite-scroll>
   * ````
   */
  async infiniteScrollEvent(event: InfiniteScrollCustomEvent): Promise<void> {
    // This can only happen if the event wasn't disabled by the `disableEvent` funtcion,
    // this means it was intentionally left enabled (to support restarting). However,
    // the paginator wasn't restarted yet, and there's no new data to be fetched now,
    // so just mark the event as complete and quit.
    if (this.keepFetching === false) {
      event.target.complete();
      return;
    }

    // We need to make a blocking call here, so that `ion-infinite-scroll` can
    // properly show the loading icon/spinner.
    await this.loadNext();
    event.target.complete();

    // Re-cast as boolean
    // (otherwise, type-script will think we narrowed it to true because of the above if
    // however the loadNext function actually could've modified the value.)
    this.keepFetching = this.keepFetching as boolean;

    // Disable infinite-scroll requesting more data, we've already loaded everything.
    if (this.keepFetching === false) {
      await this.disableEvent(event);
    }
  }
}

/** Paginate over editions of a work (by  work ID).
 *
 * This will obtain the work's editions in batches (usually of size 50,
 * but that could change).
 */
export class WorkEditionsPaginator extends BasePaginator<EditionModel> {
  constructor(
    private workId: string,
    private openLibraryApiService: OpenlibraryApiService,
    startOffset: number = 0
  ) {
    super(startOffset);
  }

  async getNext(): Promise<EditionModel[]> {
    const items = await firstValueFrom(
      this.openLibraryApiService.get_edition_batch$(this.workId, this.curIndex)
    );

    const nextOffset = items.getNextOffset();
    if (nextOffset == null) {
      this.keepFetching = false;
    } else {
      this.curIndex = nextOffset;
    }
    return items.data;
  }
}

/** Paginate over results (works) from a search.
 *
 * This uses built-in pagination of the search-API, using the page size (limit),
 * and current page number.
 */
export class SearchWorkPaginator extends BasePaginator<SearchDataModel> {
  constructor(
    private searchTerm: string,
    private openLibraryApiService: OpenlibraryApiService,
    private pageLimit: number = 20,
    startPage: number = 1
  ) {
    super(startPage);
  }

  /** Update to a new search-term, resetting the already obtained results. */
  async changeSearchTerm(searchTerm: string, startPage: number = 1) {
    this.subject.next([]);
    this.searchTerm = searchTerm;
    this.curIndex = startPage;
    this.keepFetching = true;
    await this.loadNext();
  }

  /** Override the even target disabling, and don't perform it.
   *
   * This allows us to restart the paginator (`changeSearchTerm`).
   */
  override async disableEvent(event: InfiniteScrollCustomEvent) { }

  async getNext(): Promise<SearchDataModel[]> {
    const resp = await firstValueFrom(
      this.openLibraryApiService.search$(
        this.searchTerm,
        this.curIndex,
        this.pageLimit
      )
    );
    const data = resp.data;

    // If there's less results than the expected amount, we've reached
    // the end, the next page would just be empty.
    if (data.length < this.pageLimit) {
      this.keepFetching = false;
    }

    return data;
  }
}

/** Paginate over editions marked as favorite.
 *
 * This will obtain the information about the editions from the API, one-by-one
 * (1 call per each edition), fetching in groups of `fetchSize`. That means a
 * single request for the next batch will make multiple API calls.
 */
export class FavoritesPaginator extends BasePaginator<EditionModel> {
  private favoriteIds: string[] | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private openLibraryApiService: OpenlibraryApiService,
    private fetchSize: number = 20,
    startIndex: number = 0
  ) {
    super(startIndex);
  }

  /** Restart the paginator, obtaining the favorite ids from the service again.
   *
   * This can sometimes be necessary, as the favorites may get updated.
   */
  async restart(startIndex: number = 0) {
    this.subject.next([]);
    this.curIndex = startIndex;
    this.keepFetching = true;
    this.favoriteIds = null;
    await this.loadNext();
  }

  /** Override the even target disabling, and don't perform it.
   *
   * This allows us to restart the paginator (`restart`).
   */
  override async disableEvent(event: InfiniteScrollCustomEvent) { }

  async getNext(): Promise<EditionModel[]> {
    if (this.favoriteIds == null) {
      this.favoriteIds = Array.from(await this.favoritesService.getFavorites());
    }

    if (this.curIndex + this.fetchSize >= this.favoriteIds.length) {
      this.keepFetching = false;
    }

    const toFetch = this.favoriteIds.slice(
      this.curIndex,
      Math.min(this.curIndex + this.fetchSize, this.favoriteIds.length)
    );

    this.curIndex += this.fetchSize;

    // Await all of the API call results at once
    const promises = toFetch.map((id) =>
      firstValueFrom(this.openLibraryApiService.get_edition$(id))
    );
    const results = await Promise.all(promises);

    return results;
  }
}
