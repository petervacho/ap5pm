import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { WorkResponse } from 'src/app/models/raw/work.model';
import { WorkBookshelvesResponse } from 'src/app/models/raw/work_bookshelves.model';
import { WorkRatingsResponse } from 'src/app/models/raw/work_ratings.model';
import { WorkModel } from 'src/app/models/custom/work.model';
import { EditionResponse } from 'src/app/models/raw/edition.model';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { SearchModel } from 'src/app/models/custom/search.model';
import { SearchResponse } from 'src/app/models/raw/search.model';
import { EditionBatchResponse } from 'src/app/models/raw/edition_batch.model';
import { EditionBatchModel } from 'src/app/models/custom/edition_batch.model';

@Injectable({
  providedIn: 'root',
})
export class OpenlibraryApiService {
  constructor(private http: HttpClient) { }

  search$(
    query: string,
    page_no: number = 1,
    limit: number = 10,
  ): Observable<SearchModel> {
    const encodedQuery = encodeURIComponent(query);
    const resp = this.http.get<SearchResponse>(
      `${environment.baseUrl}/search.json?limit=${limit}&page=${page_no}&q=${encodedQuery}`,
    );

    return resp.pipe(map((item) => new SearchModel(item)));
  }

  get_work$(work_key: string): Observable<WorkModel> {
    const workResp$ = this.http.get<WorkResponse>(
      `${environment.baseUrl}/works/${work_key}.json`,
    );
    const bookshelvesResp$ = this.http.get<WorkBookshelvesResponse>(
      `${environment.baseUrl}/works/${work_key}/bookshelves.json`,
    );
    const ratingsResp$ = this.http.get<WorkRatingsResponse>(
      `${environment.baseUrl}/works/${work_key}/ratings.json`,
    );

    const combinedResp$ = combineLatest([
      workResp$,
      bookshelvesResp$,
      ratingsResp$,
    ]);

    // Return a custom model class, containing all 3 responses
    return combinedResp$.pipe(
      // Only continue once we have all 3 values
      filter(
        ([workResp, bookshelvesResp, ratingsResp]) =>
          workResp !== undefined &&
          bookshelvesResp !== undefined &&
          ratingsResp !== undefined,
      ),
      map(
        ([workResp, bookshelvesResp, ratingsResp]) =>
          new WorkModel(workResp, bookshelvesResp, ratingsResp),
      ),
    );
  }

  get_edition$(edition_key: string): Observable<EditionModel> {
    const response$ = this.http.get<EditionResponse>(
      `${environment.baseUrl}/books/${edition_key}.json`,
    );

    return response$.pipe(map((rawData) => new EditionModel(rawData)));
  }

  get_edition_batch$(
    work_key: string,
    offset: number = 0,
  ): Observable<EditionBatchModel> {
    const resp = this.http.get<EditionBatchResponse>(
      `${environment.baseUrl}/works/${work_key}/editions.json?offset=${offset}`,
    );

    return resp.pipe(map((rawData) => new EditionBatchModel(rawData)));
  }
}
