import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BookSearchResponse } from 'src/app/models/search.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  data$: Observable<BookSearchResponse>;

  constructor(private openLibraryApiService: OpenlibraryApiService) {
    this.data$ = this.openLibraryApiService.search$('programming');
  }
}
