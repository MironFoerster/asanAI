import { Component, Input, OnInit, inject } from '@angular/core';
import { Lab } from '../structures/lab';
import { RouterModule } from '@angular/router';
import { LabDetails } from '../structures/lab-details';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lab-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './lab-card.component.html',
  styleUrl: './lab-card.component.sass'
})
export class LabCardComponent implements OnInit {
  @Input() lab!: LabDetails;
  @Input() isOwner: boolean = false
  enterWithRole: string = "View Lab"

  ngOnInit() {
    if (this.isOwner) {
      this.enterWithRole = "Edit Lab"
    }
  }
}
