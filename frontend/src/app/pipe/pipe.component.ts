import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChooseDataCameraComponent } from '../choose-data-camera/choose-data-camera.component';
import { ChooseDataCuratedComponent } from '../choose-data-curated/choose-data-curated.component';
import { ChooseDataGamesComponent } from '../choose-data-games/choose-data-games.component';
import { ChooseDataUploadComponent } from '../choose-data-upload/choose-data-upload.component';
import { PipeService } from '../services/pipe.service';

@Component({
  selector: 'app-pipe',
  standalone: true,
  imports: [FormsModule, ChooseDataCameraComponent, ChooseDataCuratedComponent, ChooseDataGamesComponent, ChooseDataUploadComponent],
  templateUrl: './pipe.component.html',
  styleUrl: './pipe.component.sass',
  animations: [
    trigger('minimizeMaximize', [
    state('min', style({ height: '150px', width: '150px' })),
    state('max', style({ height: '*', width: '*' })),
    transition('min <=> max', animate('0.5s ease-in-out'))
  ])
]
})
export class PipeComponent {
  dataTab: string = "";
  data = inject(PipeService)

  displayState: string = "min";
  toggleDisplayState() {
    this.displayState = this.displayState === 'min' ? 'max' : 'min';
 }
}
