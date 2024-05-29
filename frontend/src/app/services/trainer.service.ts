import { inject, Injectable } from '@angular/core';
import { Trainer } from '../structures/trainer';
import { ModelService } from '../services/model.service';
import * as tf from '@tensorflow/tfjs';
import { OPTIMIZERS } from '../constants/optimizers';
import { PipeService } from './pipe.service';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  data: Trainer = new Trainer()
  model = inject(ModelService)
  pipe = inject(PipeService)

  startTraining() {
    this.model.build()
    this.model.layersModel.compile({
      optimizer: OPTIMIZERS[this.data.optimizer].fn(this.data.optParams),
      loss: this.data.loss,
      metrics: ["accuracy"]
    })
    this.model.layersModel.fitDataset(this.pipe.dataset as tf.data.Dataset<any>, {
      epochs: this.data.epochs,
      // TODO: complete      

    })
  }
}
