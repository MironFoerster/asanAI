import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ProtoLayer } from '../structures/proto-layer';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-layer-conf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layer-conf.component.html',
  styleUrl: './layer-conf.component.sass'
})
export class LayerConfComponent {
  @Input() layerId!: number
  model = inject(ModelService)


}
