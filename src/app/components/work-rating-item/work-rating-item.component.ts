import { Component, Input, OnInit } from '@angular/core';
import { WorkModel } from 'src/app/models/custom/work.model';

@Component({
  selector: 'app-work-rating-item',
  templateUrl: './work-rating-item.component.html',
  styleUrls: ['./work-rating-item.component.scss'],
})
export class WorkRatingItemComponent implements OnInit {
  @Input({ required: true }) work!: WorkModel;

  constructor() { }

  // Return an array of 5 icon names, being one of:
  // empty star, filled star, half star.
  // This is used in the view to visually represent the rating.
  //
  // If a rating isn't available, none will be returned.
  getStarIcons(): string[] | null {
    const avgRating = this.work.rating_average;
    if (avgRating == null) {
      return null;
    }

    const floored = Math.floor(avgRating);
    const remainder = avgRating - floored;

    const stars = [];

    // As many solid stars as the floored ratings avg
    for (let i = 0; i < floored; i++) {
      stars.push('star');
    }

    // Remainders above 0.7 rendered as full stars
    if (remainder > 0.7) {
      stars.push('star');
    }
    // Remainders between 0.3 - 0.7 rendered as half-stars
    else if (remainder > 0.3) {
      stars.push('star-half-outline');
    }

    // Fill the rest with empty stars (outlines), until there's 5 stars
    const fillCount = Math.max(0, 5 - stars.length);
    for (let i = 0; i < fillCount; i++) {
      stars.push('star-outline');
    }

    return stars;
  }

  ngOnInit() { }
}
