import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainConfComponent } from './train-conf.component';

describe('TrainConfComponent', () => {
  let component: TrainConfComponent;
  let fixture: ComponentFixture<TrainConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainConfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
