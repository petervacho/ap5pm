import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { WorkDataDetails } from 'src/app/models/work.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-work-search',
  templateUrl: 'work-search.page.html',
  styleUrls: ['work-search.page.scss'],
})
export class WorkSearchPage implements OnInit {
  public items: WorkDataDetails[] = [];
  public searchTerm: string = 'tolkien';
  public pageNumber: number = 1;
  private limit: number = 20;

  constructor(
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
    private router: Router,
  ) { }

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
    this.items = [...this.items, ...result.docs];
  }

  onSearchTermChanged() {
    this.pageNumber = 1;
    this.items = [];
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
  forwardWorkData(item: WorkDataDetails) {
    this.sharedService.setData('workDetail', item);
    const work_id = item.key.slice('/works/'.length);
    this.router.navigate(['/work-detail/', work_id]);
  }
}
