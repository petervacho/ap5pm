import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkSearchPage } from './work-search.page';

describe('HomePage', () => {
  let component: WorkSearchPage;
  let fixture: ComponentFixture<WorkSearchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkSearchPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
