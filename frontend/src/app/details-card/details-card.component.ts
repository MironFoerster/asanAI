import { Component, Input } from '@angular/core';
import { Details } from '../structures/details';
import { LabDetails } from '../structures/lab-details';
import { RouterModule } from '@angular/router';
import { ModelDetails } from '../structures/model-details';
import { PipeDetails } from '../structures/pipe-details';
import { LessonDetails } from '../structures/lesson-details';

@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.sass'
})
export class DetailsCardComponent {
  @Input() itemDetails!: Details
  //@Input() cardType: string = "LabDetails"

  isLabDetails(details: Details): details is LabDetails {
    return (details as LabDetails).id !== undefined;
  }

  isModelDetails(details: Details): details is ModelDetails {
    return (details as ModelDetails).id !== undefined;
  }

  isPipeDetails(details: Details): details is PipeDetails {
    return (details as PipeDetails).id !== undefined;
  }

  isLessonDetails(details: Details): details is LessonDetails {
    return (details as LessonDetails).id !== undefined;
  }

  ngOnInit() {
    //this.cardType = typeof this.itemDetails
  }

}
