import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { Details } from '../structures/details';
import { PipeDetails } from '../structures/pipe-details';
import { ModelDetails } from '../structures/model-details';

@Component({
  selector: 'app-init-chosen-card',
  standalone: true,
  imports: [],
  templateUrl: './init-chosen-card.component.html',
  styleUrl: './init-chosen-card.component.sass'
})
export class InitChosenCardComponent implements OnInit {
  @Output() removeChosen = new EventEmitter<string>();
  @Input() chosenDetails: Details | undefined;
  cardType = signal("unknown")

  ngOnInit(): void {
    if (this.chosenDetails instanceof PipeDetails) { 
      this.cardType.set("data")
    } else if (this.chosenDetails instanceof ModelDetails) {
      this.cardType.set("model")
    } else {
      this.cardType.set("unknown")
    }
  }

  triggerRemoveSelf() {
    this.removeChosen.emit("remove")
  }
}
