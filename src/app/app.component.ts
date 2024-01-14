import { Component } from '@angular/core';
import { CurrentTheme, ThemeService } from './services/theme/theme.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
    themeService.updatePageTheme();
  }
}
