import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WorkSearchDoc } from 'src/app/models/search.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.page.html',
  styleUrls: ['./work-detail.page.scss'],
})
export class WorkDetailPage implements OnInit {
  workDetail: WorkSearchDoc;

  // Pagination stuff for the editions infinite-scroll
  loadedEditions: any[] = [];
  private editionKeys: string[];
  private batchIndex: number = 0; // essentially a page number, 0-indexed
  private batchSize: number = 20; // amount of editions to load per batch

  constructor(
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
  ) {
    this.workDetail = this.sharedService.getData('workDetail');
    this.editionKeys = this.workDetail.edition_key || [];
    this.loadNextBatch();
  }

  ngOnInit() { }

  private async loadEdition(edition_key: string) {
    const editionData = await firstValueFrom(
      this.openLibraryApiService.get_edition$(edition_key),
    );
    this.loadedEditions.push(editionData);
  }

  private async loadNextBatch() {
    const startIndex = this.batchIndex * this.batchSize;
    const endIndex = Math.min(
      (this.batchIndex + 1) * this.batchSize,
      this.editionKeys.length,
    );

    // We've already queried all editions for this work
    if (startIndex > this.editionKeys.length) {
      return;
    }
    this.batchIndex++;

    const editionKeysToLoad = this.editionKeys.slice(startIndex, endIndex);
    console.log('Loading editions: ' + editionKeysToLoad);

    await Promise.all(
      editionKeysToLoad.map((edition_key) => this.loadEdition(edition_key)),
    );
  }

  async loadData(event: any) {
    // We need this to be blocking, so that `ion-infinite-scroll` can
    // properly show the loading bar (since the API can be pretty slow).
    await this.loadNextBatch();
    event.target.complete();

    // Check if all editions are loaded
    if (this.loadedEditions.length === this.editionKeys.length) {
      event.target.disabled = true;
    }
  }
}
