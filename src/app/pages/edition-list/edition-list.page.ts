import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  firstValueFrom,
  from,
  map,
  of,
} from 'rxjs';
import { FormattedEditionData } from 'src/app/models/edition.model';
import { WorkSearchDataDetails } from 'src/app/models/work_search.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-edition-list',
  templateUrl: './edition-list.page.html',
  styleUrls: ['./edition-list.page.scss'],
})
export class EditionListPage implements OnInit {
  private workId$: Observable<string>;
  public workName$: Observable<string>;

  // Pagination stuff for the editions infinite-scroll
  private offset: number = 0;
  private keepFetching: boolean = true;
  private fetchedEditionsSubject = new BehaviorSubject<FormattedEditionData[]>(
    [],
  );
  public fetchedEditions$: Observable<FormattedEditionData[]> =
    this.fetchedEditionsSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
    private router: Router,
  ) {
    const workDetail =
      sharedService.getData<WorkSearchDataDetails>('workDetail');
    if (workDetail != null) {
      // Create an observable which only emits a single constant value
      this.workId$ = of(workDetail.key.slice('/works/'.length));
      this.workName$ = of(workDetail.title);
    } else {
      // Angular doesn't expose parameters immediately, it might take a while until they're available.
      // Subscribe to them from the params observable, into workId
      this.workId$ = this.route.params.pipe(map((params) => params['work_id']));

      // Get the work name from an API call
      this.workName$ = from(this.getWorkName()); // converts Promise to Observable
    }

    // Perform the initial load (ion-infinite-scroll won't trigger it on it's own, since
    // without any data, there's no scrollbar, and so no scroll down action to trigger it)
    this.loadEditionBatch();
  }

  ngOnInit() { }

  // Obtain the work's name from API (only used if we weren't able to get it from the shared service)
  private async getWorkName() {
    const workId = await firstValueFrom(this.workId$);
    const response = await firstValueFrom(
      this.openLibraryApiService.get_work$(workId),
    );
    return response.title;
  }

  private async loadEditionBatch() {
    if (this.keepFetching == false) {
      return;
    }

    const workId = await firstValueFrom(this.workId$);
    const response = await firstValueFrom(
      this.openLibraryApiService.get_edition_batch$(workId, this.offset),
    );

    if (response.links.next == undefined) {
      this.keepFetching = false;
    } else {
      // Figure out the next offset
      const next_url = new URL(
        response.links.next as string,
        'http://example.com', // provide a base URL, so it can be a valid URL
      );
      const offsetValue = next_url.searchParams.get('offset');

      if (offsetValue == null) {
        console.error("The next URL didn't contain an offset query param");
        this.keepFetching = false;
      } else {
        this.offset = parseInt(offsetValue, 10);
      }
    }

    const formattedEntries = response.entries.map(
      (entry) => new FormattedEditionData(entry),
    );
    this.fetchedEditionsSubject.next([
      ...this.fetchedEditionsSubject.value,
      ...formattedEntries,
    ]);
  }

  async loadData(event: any) {
    // We need this to be blocking, so that `ion-infinite-scroll` can
    // properly show the loading bar (since the API can be pretty slow).
    await this.loadEditionBatch();
    event.target.complete();

    // Check if all editions are loaded
    if (this.keepFetching == false) {
      event.target.disabled = true;
    }
  }

  redirectEdition(item: FormattedEditionData) {
    this.sharedService.setData('editionDetail', item);
    this.router.navigate(['/edition-detail/', item.edition_id]);
  }
}
