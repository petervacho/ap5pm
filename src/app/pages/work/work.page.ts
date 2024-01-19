import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { WorkModel } from 'src/app/models/custom/work.model';
import { OpenlibraryApiService } from 'src/app/services/openlibrary-api/openlibrary-api.service';
import { WorkEditionsPaginator } from 'src/app/utiliites/pagination';

@Component({
  selector: 'app-work',
  templateUrl: './work.page.html',
  styleUrls: ['./work.page.scss'],
})
export class WorkPage implements OnInit {
  workId$: Observable<string> = this.route.params.pipe(
    map((params) => params['work_id'])
  );
  workData$: Observable<WorkModel> = this.workId$.pipe(
    switchMap((workId) => {
      return this.openLibraryApiService.get_work$(workId);
    })
  );
  paginator$: Observable<WorkEditionsPaginator> = this.workId$.pipe(
    map((workId) => {
      const paginator = new WorkEditionsPaginator(
        workId,
        this.openLibraryApiService
      );

      // Start loading the first batch of works immediately.
      // This will start the loadNext async function, but it will not wait
      // for it's completion here (blocking the page load).
      // Since this will eventually just lead to an update of `this.paginator.items$`
      // observable, which the view is waiting on, and we don't need the items here,
      // we can just start this function, and leave it to eventually execute in the
      // event loop.
      paginator.loadNext();
      return paginator;
    })
  );

  constructor(
    private route: ActivatedRoute,
    private openLibraryApiService: OpenlibraryApiService
  ) { }

  ngOnInit() { }
}
