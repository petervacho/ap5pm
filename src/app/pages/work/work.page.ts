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
import { EditionModel } from 'src/app/models/custom/edition.model';
import { WorkModel } from 'src/app/models/custom/work.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.page.html',
  styleUrls: ['./work.page.scss'],
})
export class WorkPage implements OnInit {
  private workId$: Observable<string>;
  public workName$: Observable<string>;

  // Pagination stuff for the editions infinite-scroll
  private offset: number = 0;
  private keepFetching: boolean = true;
  private fetchedEditionsSubject = new BehaviorSubject<EditionModel[]>([]);
  public fetchedEditions$: Observable<EditionModel[]> =
    this.fetchedEditionsSubject.asObservable();

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
    private router: Router,
  ) {
    const workDetail = sharedService.getData<WorkModel>('workDetail');
    if (workDetail != null) {
      // Create an observable which only emits a single constant value
      this.workId$ = of(workDetail.workId);
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

    const offset = response.getNextOffset();
    if (offset == null) {
      this.keepFetching = false;
    } else {
      this.offset = offset;
    }

    this.fetchedEditionsSubject.next([
      ...this.fetchedEditionsSubject.value,
      ...response.data,
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

  redirectEdition(item: EditionModel) {
    this.sharedService.setData('editionDetail', item);
    this.router.navigate(['/edition/', item.editionId.toString()]);
  }
}
