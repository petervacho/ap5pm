import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { WorkModel } from 'src/app/models/custom/work.model';
import { FavoritesService } from 'src/app/services/favorites/favorites.service';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.page.html',
  styleUrls: ['./edition.page.scss'],
})
export class EditionPage implements OnInit {
  private editionId$: Observable<string>;
  editionData$: Observable<EditionModel>;
  workData$: Observable<WorkModel | null>;

  isStarFilled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
    private favoritesService: FavoritesService,
  ) {
    const editionData = sharedService.getData<EditionModel>('editionData');
    if (editionData != null) {
      // Create an observable which only emits a single constant value
      this.editionId$ = of(editionData.editionId);
      this.editionData$ = of(editionData);
    } else {
      // Angular doesn't expose parameters immediately, it might take a while until they're available.
      // Subscribe to them from the params observable, into workId
      this.editionId$ = this.route.params.pipe(
        map((params) => params['edition_id']),
      );
      this.editionData$ = from(this.getEditionData()); // converts Promise to Observable
    }

    this.workData$ = from(this.getWorkData());

    // Check whether this edition is in the favorite list
    this.editionId$
      .pipe(
        switchMap((editionId) => from(favoritesService.isFavorite(editionId))),
      )
      .subscribe((isFavorite) => (this.isStarFilled = isFavorite));
  }

  ngOnInit() { }

  // Obtain the edition data from API (only used if we weren't able to get it from the shared service)
  private async getEditionData(): Promise<EditionModel> {
    const editionId = await firstValueFrom(this.editionId$);
    return await firstValueFrom(
      this.openLibraryApiService.get_edition$(editionId),
    );
  }

  // Obtain the work data from API
  private async getWorkData(): Promise<WorkModel | null> {
    const editionData = await firstValueFrom(this.editionData$);
    // This will only work when there's exactly 1 work, so we can obtain
    // the ratings from that work for this edition. If this edition
    // belongs to multiple works, this logic doesn't make sense.
    if (editionData.work_ids.length != 1) {
      return null;
    }
    const workId = editionData.work_ids[0];
    return await firstValueFrom(this.openLibraryApiService.get_work$(workId));
  }

  async toggleStar() {
    this.isStarFilled = !this.isStarFilled;
    const editionId = await firstValueFrom(this.editionId$);
    await this.favoritesService.addFavorite(editionId);
  }
}
