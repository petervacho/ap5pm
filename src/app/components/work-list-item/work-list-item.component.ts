import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchDataModel } from 'src/app/models/custom/search.model';

@Component({
  selector: 'app-work-list-item',
  templateUrl: './work-list-item.component.html',
  styleUrls: ['./work-list-item.component.scss'],
})
export class WorkListItemComponent implements OnInit {
  @Input({ required: true }) work!: SearchDataModel;
  @Input() routePrefix: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  redirectToWork() {
    this.router.navigate([
      this.routePrefix,
      'work',
      this.work.workId.toString(),
    ]);
  }
}
