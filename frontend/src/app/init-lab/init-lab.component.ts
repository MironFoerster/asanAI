import { Component, computed, signal } from '@angular/core';
import { PipeDetails } from '../structures/pipe-details';
import { InitChosenCardComponent } from '../init-chosen-card/init-chosen-card.component';
import { ModelDetails } from '../structures/model-details';
import { InitChooserComponent } from '../init-chooser/init-chooser.component';


@Component({
  selector: 'app-init-lab',
  standalone: true,
  imports: [InitChosenCardComponent, InitChooserComponent],
  templateUrl: './init-lab.component.html',
  styleUrl: './init-lab.component.sass'
})
export class InitLabComponent {
  initLabButtonLabel = computed<string>(() => this.chosenDataDetails() || this.chosenModelDetails()? "Create lab with choices" : "Create blank lab")
  chosenDataDetails = signal<PipeDetails | undefined>(undefined)
  chosenModelDetails = signal<ModelDetails | undefined>(undefined)
  choosingFrom = signal<string | undefined>(undefined)
}