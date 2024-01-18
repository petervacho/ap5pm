import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SettingsPage } from '../settings/settings.page';
import { SearchWorkPaginator } from 'src/app/utiliites/pagination';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  searchTerm: string = 'Tolkien';

  paginator = new SearchWorkPaginator(
    this.searchTerm,
    this.openLibraryApiService,
  );

  constructor(
    private openLibraryApiService: OpenlibraryApiService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {
    // Start loading the first batch of works immediately.
    // This will start the loadNext async function, but it will not wait
    // for it's completion here (blocking the page load).
    // Since this will eventually just lead to an update of `this.paginator.items$`
    // observable, which the view is waiting on, and we don't need the items here,
    // we can just start this function, and leave it to eventually execute in the
    // event loop.
    this.paginator.loadNext();
  }

  /** Called whenever the user types something else in the search term. */
  async onSearchTermChanged() {
    await this.paginator.changeSearchTerm(this.searchTerm);
  }

  /** Called when the user clicks on the settings icon. */
  async openSettings() {
    const modal = await this.modalCtrl.create({ component: SettingsPage });
    await modal.present();

    // Reset the list data (start from page 1 again)
    modal.onWillDismiss().then((_) => this.onSearchTermChanged());
  }
}
