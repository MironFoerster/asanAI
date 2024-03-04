import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../structures/unit';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Space } from '../structures/space';

@Component({
  selector: 'app-space',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space.component.html',
  styleUrl: './space.component.sass'
})
export class SpaceComponent implements OnInit {
  api = inject(ApiService)
  @Input('spaceId') id?: string;
  space$?: Observable<Space>;

  ngOnInit() {
    this.space$ = this.api.get("/space/"+this.id)
  }
}
