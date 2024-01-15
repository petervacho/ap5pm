import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { SettingsPage } from '../settings/settings.page';
import { SearchDataModel } from 'src/app/models/custom/search.model';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  public searchTerm: string = 'Tolkien';

  private itemsSubject = new BehaviorSubject<SearchDataModel[]>([]);
  public items$: Observable<SearchDataModel[]> =
    this.itemsSubject.asObservable();
  public pageNumber: number = 1;
  private limit: number = 20;

  constructor(
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
    private modalCtrl: ModalController,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.search();
  }

  async search() {
    const result = await firstValueFrom(
      this.openLibraryApiService.search$(
        this.searchTerm,
        this.pageNumber,
        this.limit,
      ),
    );
    this.itemsSubject.next([...this.itemsSubject.value, ...result.data]);
  }

  onSearchTermChanged() {
    this.pageNumber = 1;
    this.itemsSubject.next([]);
    this.search();
  }

  loadData(event: any) {
    // TODO: Check max result amount, and figure out when to stop
    // (once we already obtained all returned results).
    this.pageNumber++;
    // We need this to be blocking, so that the `ion-infinite-scroll` can
    // properly show the loading bar (since the API can be pretty slow sometimes).
    // Using observables in the templates with an async pipe would be non-blocking,
    // and can cause issues with immediately requesting next page, even though the
    // previous one didn't yet load.
    this.search().then(() => event.target.complete());
  }

  // Store the data about a work that was just clicked on to the service,
  // so that it can be accessed from the detail page. This runs before routerLink
  redirectListEditions(item: SearchDataModel) {
    this.sharedService.setData('workDetail', item);
    this.router.navigate(['/work/', item.workId.toString()]);
  }

  async openSettings() {
    const modal = await this.modalCtrl.create({ component: SettingsPage });
    await modal.present();

    // Reset the list data (start from page 1 again)
    modal.onWillDismiss().then((_) => this.onSearchTermChanged());
  }
}
