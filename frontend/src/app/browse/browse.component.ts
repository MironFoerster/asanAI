import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { DetailsCardComponent } from '../details-card/details-card.component';
import { Details } from '../structures/details';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, DetailsCardComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.sass'
})
export class BrowseComponent implements OnInit {
  @Input() tab!: string
  items?: Details[]
  api = inject(ApiService)

  ngOnInit() {
    this.api.get("get-details/"+this.tab).subscribe({
      next: (items) => {
        this.items = items
        console.log(items)
      },
      error: (error) => {
        console.log("get items failed")
      }
    })
  }
}
