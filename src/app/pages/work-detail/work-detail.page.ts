import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { EditionData } from 'src/app/models/edition.model';
import { WorkDataDetails } from 'src/app/models/work.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';

// The actual JSON data returned from the API is horribly formatted to the
// point where using it in the view directly would introduce a lot of clutter.
// Instead, create a class with the formatting work already done which will be
// used in the view in place of the original response.
export class FormattedEditionData {
  title: string;
  publishers: string;
  languages: string;
  publish_date: string;

  constructor(private editionData: EditionData) {
    this.title = editionData.title;
    this.publish_date =
      editionData.publish_date != undefined ? editionData.publish_date : 'N/A';

    if (
      editionData.languages != undefined &&
      editionData.languages.length > 0
    ) {
      this.languages = editionData.languages
        .map((item) => item.key) // for some reason, the items are in { key = ... } structure
        .map((item) => item.slice('/languages/'.length)) // remove the /languaes/ prefix
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1)) // capitalize
        .join(', ');
    } else {
      this.languages = 'N/A';
    }

    if (
      editionData.publishers != undefined &&
      editionData.publishers.length > 0
    ) {
      this.publishers = editionData.publishers.join(', ');
    } else {
      this.publishers = 'N/A';
    }
  }
}

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.page.html',
  styleUrls: ['./work-detail.page.scss'],
})
export class WorkDetailPage implements OnInit {
  private workId$: Observable<string>;

  // Pagination stuff for the editions infinite-scroll
  private offset: number = 0;
  private keepFetching: boolean = true;
  public fetchedEditions: FormattedEditionData[] = [];

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService,
  ) {
    // TODO: Fetch shared work data, for work's title, if not availabel, obtain from workId url param

    // Angular doesn't expose parameters immediately, it might take a while until they're available.
    // Subscribe to them from the params observable, into workId
    this.workId$ = this.route.params.pipe(map((params) => params['work_id']));

    // Perform the initial load (ion-infinite-scroll won't trigger it on it's own, since
    // without any data, there's no scrollbar, and so no scroll down action to trigger it)
    this.loadEditionBatch();
  }

  ngOnInit() { }

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
    this.fetchedEditions = [...this.fetchedEditions, ...formattedEntries];
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
}
