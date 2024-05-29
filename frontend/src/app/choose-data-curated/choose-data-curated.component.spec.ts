import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDataCuratedComponent } from './choose-data-curated.component';

describe('ChooseDataCuratedComponent', () => {
  let component: ChooseDataCuratedComponent;
  let fixture: ComponentFixture<ChooseDataCuratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDataCuratedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseDataCuratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
