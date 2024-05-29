import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDataGamesComponent } from './choose-data-games.component';

describe('ChooseDataGamesComponent', () => {
  let component: ChooseDataGamesComponent;
  let fixture: ComponentFixture<ChooseDataGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDataGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseDataGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
