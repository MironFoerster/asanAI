import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseModelComponent } from './choose-model.component';

describe('ChooseModelComponent', () => {
  let component: ChooseModelComponent;
  let fixture: ComponentFixture<ChooseModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
