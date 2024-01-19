import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EditionModel } from 'src/app/models/custom/edition.model';

@Component({
  selector: 'app-edition-list-item',
  templateUrl: './edition-list-item.component.html',
  styleUrls: ['./edition-list-item.component.scss'],
})
export class EditionListItemComponent implements OnInit {
  @Input({ required: true }) edition!: EditionModel;
  @Input() routePrefix: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  redirectToEdition() {
    this.router.navigate([
      this.routePrefix,
      'edition',
      this.edition.editionId.toString(),
    ]);
  }
}
