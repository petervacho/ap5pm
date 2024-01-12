import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditionListPage } from './edition-list.page';

describe('WorkDetailPage', () => {
  let component: EditionListPage;
  let fixture: ComponentFixture<EditionListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
