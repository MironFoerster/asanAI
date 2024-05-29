import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Lab } from '../structures/lab';
import { ModelService } from './model.service';
import { PipeService } from '../services/pipe.service';
import { Model } from '../structures/model';
import { TrainerService } from '../services/trainer.service';
import { LabData } from '../structures/lab-data';
import { Pipe } from '../structures/pipe';
import { Trainer } from '../structures/trainer';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  data: Lab = new Lab()
  trainer = inject(TrainerService)
  model = inject(ModelService)
  pipe = inject(PipeService)
  api = inject(ApiService)

  hasId(id: string | null): boolean {
    return this.data.id === id
  }

  getId(): string|null {return this.data.id}

  load(id: string, version: number) {
    let v: string = "/"+version.toString()

    this.api.get("get-lab-data/"+id+v).subscribe({
      next: (labData: LabData) => {
        this.data = labData.lab
        this.model.data = labData.model
        this.pipe.data = labData.pipe
        this.trainer.data = labData.trainer
        console.log(labData)
      },
      error: (error) => {
        console.log("load lab failure")
      }
    })
  }

  loadAnonymous() {
    this.data = new Lab()
    this.model.data = new Model()
    this.pipe.data = new Pipe()
    this.trainer.data = new Trainer()
  }


  clone(fromLabId: string) {
    this.api.get("get-lab-data/"+fromLabId).subscribe({
      next:  (labData: LabData) => {
        this.data = labData.lab
        this.model.data = labData.model
        this.pipe.data = labData.pipe
        this.trainer.data = labData.trainer
      },
      error: (error) => {
        console.log("import lab failure")
      }
    })
  }

  syncLab() {
    this.api.post("sync-lab/"+this.data.id, this.data).subscribe({
      next: (labData: Lab) => {
        console.log("sync success")
      },
      error: (error) => {
        console.log("sync failure")
      }
    })
  }
}
