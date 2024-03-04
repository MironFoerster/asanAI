import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitChooserCardComponent } from './init-chooser-card.component';

describe('InitChooserCardComponent', () => {
  let component: InitChooserCardComponent;
  let fixture: ComponentFixture<InitChooserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitChooserCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitChooserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
