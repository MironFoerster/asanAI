import { Component, Input } from '@angular/core';
import { Details } from '../structures/details';

@Component({
  selector: 'app-init-chooser-card',
  standalone: true,
  imports: [],
  templateUrl: './init-chooser-card.component.html',
  styleUrl: './init-chooser-card.component.sass'
})
export class InitChooserCardComponent {
  @Input() cardDetails: Details | undefined;
}
