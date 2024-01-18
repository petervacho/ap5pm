import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { WorkResponse } from 'src/app/models/responses/work.model';
import { WorkBookshelvesResponse } from 'src/app/models/responses/work_bookshelves.model';
import { WorkRatingsResponse } from 'src/app/models/responses/work_ratings.model';
import { WorkModel } from 'src/app/models/custom/work.model';
import { EditionResponse } from 'src/app/models/responses/edition.model';
import { EditionModel } from 'src/app/models/custom/edition.model';
import { SearchModel } from 'src/app/models/custom/search.model';
import { SearchResponse } from 'src/app/models/responses/search.model';
import { EditionBatchResponse } from 'src/app/models/responses/edition_batch.model';
import { EditionBatchModel } from 'src/app/models/custom/edition_batch.model';

@Injectable({
  providedIn: 'root',
})
export class OpenlibraryApiService {
  constructor(private http: HttpClient) { }

  /** Perform a search for given query, returning the matching responses.
   *
   * Uses the `/search.json` endpoint.
   *
   * This is a paginated search, as getting back all of the matching responses
   * could mean fetching megabytes of data in some cases, and could be fairly slow.
   *
   * The pagination is handled directly by the API, the caller is responsible for
   * obtaining more data when needed using `page_no`.
   */
  search$(
    query: string,
    pageNo: number = 1,
    limit: number = 10,
  ): Observable<SearchModel> {
    const encodedQuery = encodeURIComponent(query);
    const resp = this.http.get<SearchResponse>(
      `${environment.baseUrl}/search.json?limit=${limit}&page=${pageNo}&q=${encodedQuery}`,
    );

    return resp.pipe(map((item) => new SearchModel(item)));
  }

  /** Obtain data about given work (by the work's ID).
   *
   * Uses the `/works/[ID].json`, `/works/[ID]/bookshelves.json` and `works/[ID]/ratings.json` endpoints.
   *
   * This will combine the results of multiple responses in a single returned model object.
   */
  get_work$(workId: string): Observable<WorkModel> {
    const workResp$ = this.http.get<WorkResponse>(
      `${environment.baseUrl}/works/${workId}.json`,
    );
    const bookshelvesResp$ = this.http.get<WorkBookshelvesResponse>(
      `${environment.baseUrl}/works/${workId}/bookshelves.json`,
    );
    const ratingsResp$ = this.http.get<WorkRatingsResponse>(
      `${environment.baseUrl}/works/${workId}/ratings.json`,
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

  /** Obtain data about given edition (by the edition's ID).
   *
   * Uses the `/books/[ID].json` endpoint.
   */
  get_edition$(editionId: string): Observable<EditionModel> {
    const response$ = this.http.get<EditionResponse>(
      `${environment.baseUrl}/books/${editionId}.json`,
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
