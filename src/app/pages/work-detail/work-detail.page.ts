import { Component, OnInit } from '@angular/core';
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

  constructor(
    private openLibraryApiService: OpenlibraryApiService,
    private sharedService: SharedService,
  ) {
    this.workDetail = this.sharedService.getData('workDetail');
  }

  ngOnInit() {}
}
