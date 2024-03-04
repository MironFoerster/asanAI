import { Component, Input, signal } from '@angular/core';
import { InitChooserCardComponent } from '../init-chooser-card/init-chooser-card.component';
import { CardsSection } from '../structures/cards-section';
import { UploadDatasetComponent } from '../upload-dataset/upload-dataset.component';

@Component({
  selector: 'app-init-chooser',
  standalone: true,
  imports: [InitChooserCardComponent, UploadDatasetComponent],
  templateUrl: './init-chooser.component.html',
  styleUrl: './init-chooser.component.sass'
})
export class InitChooserComponent {
  @Input() chooserType: string | undefined;
  sectionedCards = signal<CardsSection[] | undefined>(undefined)
  showUploadDataset = signal<Boolean>(false)
}
