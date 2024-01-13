import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom, from, map, of } from 'rxjs';
import {
  EditionData,
  FormattedEditionData,
} from 'src/app/models/edition.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-edition-detail',
  templateUrl: './edition-detail.page.html',
  styleUrls: ['./edition-detail.page.scss'],
})
export class EditionDetailPage implements OnInit {
  private editionId$: Observable<string>;
  public editionData$: Observable<FormattedEditionData>;

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
  ) {
    const editionData =
      sharedService.getData<FormattedEditionData>('editionData');
    if (editionData != null) {
      // Create an observable which only emits a single constant value
      this.editionId$ = of(editionData.edition_id);
      this.editionData$ = of(editionData);
    } else {
      // Angular doesn't expose parameters immediately, it might take a while until they're available.
      // Subscribe to them from the params observable, into workId
      this.editionId$ = this.route.params.pipe(
        map((params) => params['edition_id']),
      );
      this.editionData$ = from(this.getEditionData()); // converts Promise to Observable
    }
  }

  ngOnInit() { }

  // Obtain the edition data from API (only used if we weren't able to get it from the shared service)
  private async getEditionData(): Promise<FormattedEditionData> {
    const editionId = await firstValueFrom(this.editionId$);
    return await firstValueFrom(
      this.openLibraryApiService.get_edition$(editionId),
    );
  }
}
