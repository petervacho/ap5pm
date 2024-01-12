import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditionDetailPage } from './edition-detail.page';

describe('EditionDetailPage', () => {
  let component: EditionDetailPage;
  let fixture: ComponentFixture<EditionDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
