import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { OpenlibraryApiService } from '../services/openlibrary-api/openlibrary-api.service';
import { SearchDataModel, SearchModel } from '../models/custom/search.model';

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
    // We need to make a blocking call here, so that `ion-infinite-scroll` can
    // properly show the loading icon/spinner.
    await this.loadNext();
    event.target.complete();

    // Disable infinite-scroll requesting more data, we've already loaded everything.
    if (this.keepFetching === false) {
      event.target.disabled = true;
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
    startOffset: number = 0,
  ) {
    super(startOffset);
  }

  async getNext(): Promise<EditionModel[]> {
    const items = await firstValueFrom(
      this.openLibraryApiService.get_edition_batch$(this.workId, this.curIndex),
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
    startPage: number = 1,
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

  async getNext(): Promise<SearchDataModel[]> {
    const resp = await firstValueFrom(
      this.openLibraryApiService.search$(
        this.searchTerm,
        this.curIndex,
        this.pageLimit,
      ),
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