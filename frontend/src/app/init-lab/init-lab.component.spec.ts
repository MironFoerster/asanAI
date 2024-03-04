import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitLabComponent } from './init-lab.component';

describe('InitLabComponent', () => {
  let component: InitLabComponent;
  let fixture: ComponentFixture<InitLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitLabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
