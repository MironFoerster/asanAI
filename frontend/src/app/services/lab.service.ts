import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Lab } from '../structures/lab';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  data: Lab = new Lab()
  api = inject(ApiService)

  hasId(id: string | null): boolean {
    return this.data.id === id
  }

  getId(): string|null {return this.data.id}

  load(id: string) {
    this.api.get("get-lab/"+id).subscribe({
      next: (labData: Lab) => {
        this.data = labData
      },
      error: (error) => {
        console.log("load lab failure")
      }
    })
  }

  loadAnonymous() {
    this.data = new Lab()
  }

  importModel(fromModelId: string) {
    this.api.get("get-model/"+fromModelId).subscribe({
      next:  (modelData) => {
        this.data.model = modelData
      },
      error: (error) => {
        console.log("import model failure")
      }
    })
  }

  importPipe(fromPipeId: string) {
    this.api.get("get-pipe/"+fromPipeId).subscribe({
      next:  (pipeData) => {
        this.data.pipe = pipeData
      },
      error: (error) => {
        console.log("import pipe failure")
      }
    })
  }

  importLab(fromLabId: string) {
    this.api.get("get-lab/"+fromLabId).subscribe({
      next:  (labData) => {
        this.data = labData
      },
      error: (error) => {
        console.log("import lab failure")
      }
    })
  }

  sync() {
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
