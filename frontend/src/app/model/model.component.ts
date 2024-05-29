import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { Model } from '../structures/model';
import { ApiService } from '../services/api.service';
import { Lab } from '../structures/lab';
import * as THREE from 'three';
//import { RoundedBoxGeometry } from 'three-rounded-box';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RenderService } from '../services/render.service';
import { FormsModule } from '@angular/forms';
import { LayerLabel } from '../structures/render/features/layer-label';
import { ModelService } from '../services/model.service';
import { LAYERS } from '../constants/layers';
import { ProtoLayer } from '../structures/proto-layer';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.sass'
})
export class ModelComponent implements AfterViewInit {
  @ViewChild('modelCanvas') rendererCanvas!: ElementRef;

  @Input() modelInfo?: Model;
  @Input() activeDragType: string = "";

  @Output() finishDrag: EventEmitter<string> = new EventEmitter();
  @Output() configureLayer: EventEmitter<number> = new EventEmitter();
 
  renderer = inject(RenderService)
  model = inject(ModelService)
 
  
  ngAfterViewInit() {
    this.renderer.initRenderer(this.rendererCanvas.nativeElement);
    this.renderer.startRender()
    this.renderer.addLight()
  }

  handleClick(event: MouseEvent) {
    console.log("hhhh")
    if (this.renderer.data.pickedObject) {
      for (let layerId in this.renderer.data.layerEntities) {
        if (this.renderer.data.layerEntities[layerId].transform == this.renderer.data.pickedObject.parent){
          this.configureLayer.emit(Number(layerId))
        }
      }
    }
  }

  handleMouseenter(event: MouseEvent) {
    event.preventDefault()
    if (this.activeDragType) {
      this.renderer.addDragLayer(this.activeDragType)
      for (let inputId in this.renderer.data.edgeEntities) {
        for (let outputId in this.renderer.data.edgeEntities[inputId]) {
          this.renderer.data.edgeEntities[inputId][outputId].features[1].stateMachine.transition("transOn")
        }
      }
    }
  }
  handleMouseup(event: MouseEvent) {
    console.log('asasfsdsg');
    if (this.activeDragType) {
      this.handleDrop()
    }
  }
  handleMouseleave(event:MouseEvent) {
    this.renderer.clearPickPosition()
    if (this.activeDragType) {
      this.renderer.removeDragLayer()
      this.endDrag()
    }
    
  }
  handleDrop() {
    if (!this.renderer.data.dragLayer) {return}
    if (this.renderer.data.pickedObject) {
      for (let inputId in this.renderer.data.edgeEntities) {
        for (let outputId in this.renderer.data.edgeEntities[inputId]) {
          // If is on any edge
          if (this.renderer.data.edgeEntities[inputId][outputId].transform == this.renderer.data.pickedObject.parent) {
            this.renderer.data.dragLayer.features[0].stateMachine.transition("loading")
            const labelFeature = this.renderer.data.dragLayer.features[1] as LayerLabel
            const newId = this.model.addProtoLayer(labelFeature.layerType, new Set<number>([Number(inputId)]), new Set<number>([Number(outputId)]), LAYERS[this.activeDragType].config)
            this.renderer.data.layerEntities[Number(newId)] = this.renderer.data.dragLayer
            this.renderer.data.dragLayer = undefined
            console.log(this.renderer.data.layerEntities)
            this.renderer.triggerRearrange(...this.model.computeGraph())
            this.endDrag()
            return
          }
        }
      }
    }
    this.renderer.removeDragLayer()
    this.endDrag()
  }

  endDrag() {
    this.finishDrag.emit()
    for (let inputId in this.renderer.data.edgeEntities) {
      for (let outputId in this.renderer.data.edgeEntities[inputId]) {
        this.renderer.data.edgeEntities[inputId][outputId].features[1].stateMachine.transition("transOff")
      }
    }
  }
}
