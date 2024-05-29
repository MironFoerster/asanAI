import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDataUploadComponent } from './choose-data-upload.component';

describe('ChooseDataUploadComponent', () => {
  let component: ChooseDataUploadComponent;
  let fixture: ComponentFixture<ChooseDataUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDataUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseDataUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
