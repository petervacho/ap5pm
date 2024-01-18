import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lazy-img',
  templateUrl: './lazy-img.component.html',
  styleUrls: ['./lazy-img.component.scss'],
})
export class LazyImgComponent implements OnInit {
  /** URL to the image to be lazy-loaded. */
  @Input({ alias: 'src', required: true }) imgSrc!: string | null;

  /** Icon shown if the image failed to load. */
  @Input() errorIconName: string = '';

  /** Icon shown if the imgSrc is null. */
  @Input() nullIconName: string = '';

  isLoading: boolean = true;
  isError: boolean = false;
  isSuccess: boolean = false;

  constructor() { }

  ngOnInit() { }

  /** The image finished loading successfully. */
  onIconLoad() {
    this.isLoading = false;
    this.isSuccess = true;
  }

  /** The image failed to load. */
  onIconError() {
    this.isLoading = false;
    this.isError = true;
  }
}
