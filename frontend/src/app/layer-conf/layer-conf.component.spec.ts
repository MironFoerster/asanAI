import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerConfComponent } from './layer-conf.component';

describe('LayerConfComponent', () => {
  let component: LayerConfComponent;
  let fixture: ComponentFixture<LayerConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerConfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LayerConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
