import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom, from, map, of, switchMap } from 'rxjs';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { WorkModel } from 'src/app/models/custom/work.model';
import { FavoritesService } from 'src/app/services/favorites/favorites.service';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.page.html',
  styleUrls: ['./edition.page.scss'],
})
export class EditionPage implements OnInit {
  private editionId$: Observable<string> = this.route.params.pipe(
    map((params) => params['edition_id'])
  );
  editionData$: Observable<EditionModel> = this.editionId$.pipe(
    switchMap((editionId) => this.openLibraryApiService.get_edition$(editionId))
  );
  workData$: Observable<WorkModel | null> = this.editionData$.pipe(
    map((editionData) => editionData.work_ids),
    switchMap((workIds) =>
      // This will only work when there's exactly 1 work, so we can obtain the ratings
      // from that work for this edition. If this edition belongs to multiple works,
      // this logic doesn't make sense. However, vast majority (if not all) editions will
      // only have 1 associated work.
      workIds.length == 1
        ? this.openLibraryApiService.get_work$(workIds[0])
        : of(null)
    )
  );

  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    // Check whether this edition is in the favorite list
    this.editionId$
      .pipe(
        switchMap((editionId) =>
          from(this.favoritesService.isFavorite(editionId))
        )
      )
      .subscribe((isFavorite) => (this.isFavorite = isFavorite));
  }

  /** Called when the user clicks on the star icon (to mark this edition as favorite). */
  async toggleFavorite() {
    const editionId = await firstValueFrom(this.editionId$);

    if (!this.isFavorite) {
      this.isFavorite = true;
      await this.favoritesService.addFavorite(editionId);
    } else {
      this.isFavorite = false;
      await this.favoritesService.removeFavorite(editionId);
    }
  }
}
