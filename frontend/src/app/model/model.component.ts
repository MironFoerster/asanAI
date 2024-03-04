import { Component, Input, OnInit, inject } from '@angular/core';
import { Model } from '../structures/model';
import { ApiService } from '../services/api.service';
import { Lab } from '../structures/lab';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [],
  templateUrl: './model.component.html',
  styleUrl: './model.component.sass'
})
export class ModelComponent implements OnInit {
  @Input() model?: Model
  api = inject(ApiService)

  ngOnInit() {
    // this.api.get("get-lab/"+id).subscribe({
    //   next: (labData: Lab) => {
    //     this.data = labData
    //   },
    //   error: (error) => {
    //     console.log("load model failure")
    //   }
    // })
  }
}
