import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkDetailPage } from './work-detail.page';

describe('WorkDetailPage', () => {
  let component: WorkDetailPage;
  let fixture: ComponentFixture<WorkDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WorkDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
