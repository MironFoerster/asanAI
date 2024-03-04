import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { Lab } from '../structures/lab';
import { CommonModule } from '@angular/common';
import { LabCardComponent } from '../lab-card/lab-card.component';
import { DetailsCardComponent } from '../details-card/details-card.component';
import { LabDetails } from '../structures/lab-details';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LabCardComponent, DetailsCardComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit{
  api = inject(ApiService)
  auth = inject(AuthService)
  labs?: LabDetails[]
  shared_labs?: LabDetails[]
  ngOnInit() {
    this.api.get("dashboard-labs").subscribe({
      next: (dashboard_labs) => {
        this.labs = dashboard_labs.labs
        this.shared_labs = dashboard_labs.shared_labs
      }
    })
    console.log(this.labs)
    console.log(this.shared_labs)
  }
}
