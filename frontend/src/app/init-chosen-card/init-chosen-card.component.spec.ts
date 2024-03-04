import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitChosenCardComponent } from './init-chosen-card.component';

describe('InitChosenCardComponent', () => {
  let component: InitChosenCardComponent;
  let fixture: ComponentFixture<InitChosenCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitChosenCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitChosenCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
