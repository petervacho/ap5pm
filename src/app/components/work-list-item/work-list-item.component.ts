import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchDataModel } from 'src/app/models/custom/search.model';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-work-list-item',
  templateUrl: './work-list-item.component.html',
  styleUrls: ['./work-list-item.component.scss'],
})
export class WorkListItemComponent implements OnInit {
  @Input() work!: SearchDataModel;
  @Input() routePrefix: string = '';

  constructor(
    private sharedService: SharedService,
    private router: Router,
  ) {}

  ngOnInit() {}

  redirectToWork() {
    this.sharedService.setData('workDetail', this.work);
    this.router.navigate([
      this.routePrefix,
      'work',
      this.work.workId.toString(),
    ]);
  }
}
