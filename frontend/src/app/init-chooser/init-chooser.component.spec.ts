import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitChooserComponent } from './init-chooser.component';

describe('InitChooserComponent', () => {
  let component: InitChooserComponent;
  let fixture: ComponentFixture<InitChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitChooserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
