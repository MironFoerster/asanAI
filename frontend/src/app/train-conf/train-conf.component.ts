import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../services/trainer.service';
import { LabService } from '../services/lab.service';
import { CommonModule } from '@angular/common';
import { OPTIMIZERS } from '../constants/optimizers';
import { LOSSES } from '../constants/losses';

@Component({
  selector: 'app-train-conf',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './train-conf.component.html',
  styleUrl: './train-conf.component.sass'
})
export class TrainConfComponent implements OnInit {
  @Input() clearForTraining: boolean = false
  @Output() startTraining: EventEmitter<any> = new EventEmitter();
  trainer = inject(TrainerService)

  public get OPTIMIZERS() {
    return OPTIMIZERS;
  }
  public get LOSSES() {
    return LOSSES;
  }

  setOptDefaults() {
    for(let param of OPTIMIZERS[this.trainer.data.optimizer].params) {
      this.trainer.data.optParams[param.name] = param.default
    }
  }

  ngOnInit(): void {
    this.setOptDefaults()
  }

}
