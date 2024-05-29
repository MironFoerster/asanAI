import { Component, EventEmitter, Output } from '@angular/core';
import { GROUPED_LAYERS } from '../constants/layers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-layer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-layer.component.html',
  styleUrl: './add-layer.component.sass'
})
export class AddLayerComponent {
  @Output() dragLayer: EventEmitter<string> = new EventEmitter();
  @Output() prepareLayer: EventEmitter<string> = new EventEmitter();

  isDragging: boolean = false
  isDragstart: boolean = false
  startOnType: string = ""

  public get GROUPED_LAYERS() {
    return GROUPED_LAYERS;
  }

  handleClick(event: MouseEvent, layerType: string) {
    this.prepareLayer.emit(layerType)
  }

  handleMouseDown(layerType: string) {
    console.log("EMMMET")
    this.dragLayer.emit(layerType)
  
  }

  handleAnyMouseUp() {

      this.dragLayer.emit("")
    
  }
}
