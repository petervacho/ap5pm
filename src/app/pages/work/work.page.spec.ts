import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkPage } from './work.page';

describe('WorkDetailPage', () => {
  let component: WorkPage;
  let fixture: ComponentFixture<WorkPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WorkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
