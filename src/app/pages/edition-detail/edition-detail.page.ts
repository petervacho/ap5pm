import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';

@Component({
  selector: 'app-edition-detail',
  templateUrl: './edition-detail.page.html',
  styleUrls: ['./edition-detail.page.scss'],
})
export class EditionDetailPage implements OnInit {
  editionId$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService,
  ) {
    // Angular doesn't expose parameters immediately, it might take a while until they're available.
    // Subscribe to them from the params observable, into workId
    this.editionId$ = this.route.params.pipe(
      map((params) => params['edition_id']),
    );
  }

  ngOnInit() { }
}
