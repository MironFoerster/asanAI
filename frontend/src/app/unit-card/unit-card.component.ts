import { Component, Input } from '@angular/core';
import { Unit } from '../structures/unit';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [],
  templateUrl: './unit-card.component.html',
  styleUrl: './unit-card.component.sass'
})
export class UnitCardComponent {
  @Input() unit?: Unit;
}
