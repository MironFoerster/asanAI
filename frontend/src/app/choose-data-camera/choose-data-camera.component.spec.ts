import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDataCameraComponent } from './choose-data-camera.component';

describe('ChooseDataCameraComponent', () => {
  let component: ChooseDataCameraComponent;
  let fixture: ComponentFixture<ChooseDataCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDataCameraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseDataCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
