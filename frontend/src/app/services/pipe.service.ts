import { inject, Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Pipe } from '../structures/pipe';
import * as tf from '@tensorflow/tfjs'

@Injectable({
  providedIn: 'root'
})
export class PipeService {
  data: Pipe = new Pipe();
  dataset?: tf.data.Dataset<any>;
  api = inject(ApiService)

  constructor() {
    this.dataset = tf.data.csv(
      "loaclhost:8000/media/titanic.csv", {
        columnConfigs: {
          Survived: {
            isLabel: true
          }
        }
      })
    console.log(this.dataset)
  }

  clone(fromPipeId: string) {
    this.api.get("get-pipe/"+fromPipeId).subscribe({
      next:  (pipeData) => {
        this.data = pipeData
      },
      error: (error) => {
        console.log("import pipe failure")
      }
    })
  }
}
