import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom, from, map } from 'rxjs';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { FavoritesService } from 'src/app/services/favorites/favorites.service';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { FavoritesPaginator } from 'src/app/utiliites/pagination';

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
  paginator = new FavoritesPaginator(
    this.favoritesService,
    this.openLibraryApiService
  );

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
    // It isn't really necessary to call restart on first load, but it's also not
    // expensive enough to the point where it would be an issue, and we do need it
    // called in the subsequent calls.
    // (i.e. I'm too lazy to safe-guard this with a bool flag)
    //
    // This will also perform the initial load.
    // (Note: This is an async function, but we're not waiting for it to finish here,
    // since this function is synchronous. Just let it run in the event loop. This is
    // fine, because it will eventually just lead to updating `this.paginator.items$`
    // observable, which the view is waiting on)
    this.paginator.restart();
  }
}
