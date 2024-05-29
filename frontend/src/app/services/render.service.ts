import { inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EntityManager } from '../structures/render/entity-manager';
import { InputManager } from '../structures/render/input-manager';
import { LayerBox } from '../structures/render/features/layer-box';
import { RenderEdge, RenderEdges, RenderLayer, RenderLayers } from '../structures/render/data-types';
import { Indicator } from '../structures/render/features/indicator';
import { Entity } from '../structures/render/entity';
import { Edge } from '../structures/render/features/edge';
import { LayerLabel } from '../structures/render/features/layer-label';
import { ProtoLayer, ProtoLayers } from '../structures/proto-layer';
import TWEEN from '@tweenjs/tween.js';
import { ModelService } from './model.service';
import { LAYERS } from '../constants/layers';

class SimpleMovingAverage {
  private dataset: number[];
  private period: number;
  private sum: number;

  constructor(period: number) {
      this.dataset = [];
      this.period = period;
      this.sum = 0;
  }

  addData(num: number): void {
      this.sum += num;
      this.dataset.push(num);

      if (this.dataset.length > this.period) {
          this.sum -= this.dataset.shift()!;
      }
  }

  getMean(): number {
      return Math.ceil(this.sum / this.period);
  }
}


export interface RenderData {
  protoLayers: ProtoLayers;
  cursorOnPlane: THREE.Vector3;
  dragLayer?: Entity;
  layerEntities: {[key: number]: Entity};
  edgeEntities: {[key: number]: {[key: number]: Entity}};
  indicatorIds: number[]
  renderLayers: RenderLayers
  renderEdges: RenderEdges
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  raycaster: THREE.Raycaster
  deltaTime: number
  pickPosition: THREE.Vector2
  pickedObject?: THREE.Object3D
  entityManager: EntityManager
  inputManager: InputManager
}

@Injectable({
 providedIn: 'root'
})
export class RenderService {
  data: RenderData
  then: number
  now: number
  sma: SimpleMovingAverage
  XYplane: THREE.Plane
  needCameraFit: boolean = false


 constructor() {
  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far)
  camera.position.set(0, 0, 500); // X, Y, Z coordinates
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  const mockupRenderer = new THREE.WebGLRenderer()
  this.then = 0
  this.now = 0
  this.sma = new SimpleMovingAverage(30);
  this.XYplane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);


  this.data = {
    layerEntities: {},
    edgeEntities: {},
    cursorOnPlane: new THREE.Vector3(),
    indicatorIds: [],
    renderLayers: {},
    renderEdges: {},
    protoLayers: {},
    scene: new THREE.Scene(),
    camera: camera,
    renderer: new THREE.WebGLRenderer({
      canvas: document.createElement("canvas"),
      alpha: true,
      antialias: true
    }),
    raycaster: new THREE.Raycaster(),
    deltaTime: 0,
    pickPosition: new THREE.Vector2(0, 0),
    pickedObject: undefined,
    entityManager: new EntityManager(),
    inputManager: new InputManager(),
  }

  this.clearPickPosition()
  this.data.scene.add(this.data.camera );
 }

 initRenderer(canvas: HTMLCanvasElement) {
    this.data.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    this.data.renderer.setClearColor(0x000000, 0);
 }

 buildRender(renderLayers: RenderLayers, renderEdges: RenderEdges, protoLayers: ProtoLayers) {
  console.log("BUILDING")
  this.data.renderLayers = renderLayers
  this.data.renderEdges = renderEdges
  this.data.protoLayers = protoLayers

  this.data.entityManager.resetScene()

  let entity: Entity
  for (let layerId in this.data.renderLayers) {
    entity = this.data.entityManager.createEntity(this.data, this.data.scene, "layer"+layerId)
    entity.addFeature( LayerBox, this.data.renderLayers[layerId])
    entity.addFeature( Indicator)
    entity.addFeature( LayerLabel, this.data.protoLayers[layerId].name, this.data.protoLayers[layerId].type)
    this.data.layerEntities[layerId] = entity
  }
  for (let edgeInputId in this.data.renderEdges) {
    for (let edgeOutputId in this.data.renderEdges[edgeInputId]) {
      entity = this.data.entityManager.createEntity(this.data, this.data.scene, `edge${edgeInputId}_${edgeOutputId}`)
      entity.addFeature( Edge, this.data.renderEdges[edgeInputId][edgeOutputId])
      entity.addFeature( Indicator)
      if (!this.data.edgeEntities[edgeInputId]) {
        this.data.edgeEntities[edgeInputId] = {};
      }
      this.data.edgeEntities[edgeInputId][edgeOutputId] = entity
    }
  }
  this.needCameraFit = true
  console.log("DONEDONEBUILDING")
  console.log(this.data.scene)
 }

 
 triggerRearrange(renderLayers: RenderLayers, renderEdges: RenderEdges, protoLayers: ProtoLayers) {

  this.data.renderLayers = renderLayers
  this.data.renderEdges = renderEdges
  this.data.protoLayers = protoLayers

  for (let layerId in this.data.layerEntities) {
    this.data.layerEntities[layerId].features[0].stateMachine.transition("transIdle")

  }
  for (let edgeInputId in this.data.renderEdges) {
    for (let edgeOutputId in this.data.renderEdges[edgeInputId]) {
      // add new entities
      if (!this.data.edgeEntities[edgeInputId][edgeOutputId]) {
        let entity = this.data.entityManager.createEntity(this.data, this.data.scene, `edge${edgeInputId}_${edgeOutputId}`)
        entity.addFeature( Edge, this.data.renderEdges[edgeInputId][edgeOutputId])
        entity.addFeature( Indicator)
        if (!this.data.edgeEntities[edgeInputId]) {
          this.data.edgeEntities[edgeInputId] = {};
        }
        this.data.edgeEntities[edgeInputId][edgeOutputId] = entity
      }
      this.data.edgeEntities[edgeInputId][edgeOutputId].features[0].stateMachine.transition("transIdleIdle")
    }
  }
  this.needCameraFit = true
 }

 fitCameraToScene() {
  let bounds: THREE.Box3 = new THREE.Box3()
  let first: boolean = true
  this.data.scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (first) {
        bounds = new THREE.Box3().setFromObject(obj)
        first = false
      } else {
        bounds.expandByObject(obj)
      }
    }
  });
  const center: THREE.Vector3 = new THREE.Vector3()
  bounds.getCenter(center)
  const size: THREE.Vector3 = new THREE.Vector3()
  bounds.getSize(size)
  const camPos: THREE.Vector3 = new THREE.Vector3()
  camPos.copy(center).setZ(size.x*1.7)

  
  new TWEEN.Tween(this.data.camera.position).to(
    camPos, 1000
  ).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(()=> {
    this.data.camera.lookAt(center);
  })
  .start()
  //this.data.camera.position.copy(center);
  
}

   addLight() {
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 5); // Color and intensity
   this.data.scene.add(ambientLight);

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
      this.data.camera.add(directionalLight);
   }
   
   getCanvasRelativePosition(event: MouseEvent) {
   const rect = this.data.renderer.domElement.getBoundingClientRect();
   return {
      x: (event.clientX - rect.left) * this.data.renderer.domElement.width  / rect.width,
      y: (event.clientY - rect.top ) * this.data.renderer.domElement.height / rect.height,
   };
   }
   
   setPickPosition(event: MouseEvent) {
   const pos = this.getCanvasRelativePosition(event);
   this.data.pickPosition.x = (pos.x / this.data.renderer.domElement.width ) *  2 - 1;
   this.data.pickPosition.y = (pos.y / this.data.renderer.domElement.height) * -2 + 1;  // note we flip Y
   }
   
   clearPickPosition() {
   // unlike the mouse which always has a position
   // if the user stops touching the screen we want
   // to stop picking. For now we just pick a value
   // unlikely to pick something
   this.data.pickPosition.x = -100000;
   this.data.pickPosition.y = -100000;
   }

   pick() {
      // cast a ray through the frustum
      this.data.raycaster.setFromCamera(this.data.pickPosition, this.data.camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.data.raycaster.intersectObjects(this.data.scene.children.filter((obj) => {
          return !(obj.name == "draglayer")
        }
      ));
      if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.data.pickedObject = intersectedObjects[0].object;
      } else {
         this.data.pickedObject = undefined
      }
   }

   intersectPlane() {
    this.data.raycaster.setFromCamera(this.data.pickPosition, this.data.camera);
    this.data.raycaster.ray.intersectPlane(this.XYplane, this.data.cursorOnPlane)
   }

   addDragLayer(layerType: string) {
    this.data.dragLayer = this.data.entityManager.createEntity(this.data, this.data.scene, "draglayer")
    this.data.dragLayer.addFeature(LayerBox, {position: this.data.cursorOnPlane, layerId: -1}, "drag")
    this.data.dragLayer.addFeature(LayerLabel, "draglayer", layerType)
    this.data.dragLayer.addFeature( Indicator)
   }

   removeDragLayer() {
    if (this.data.dragLayer){
      this.data.dragLayer.features[0].stateMachine.transition("transRemove")
    }
   }

   resizeRendererToDisplaySize( renderer: THREE.WebGLRenderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if ( needResize ) {
         renderer.setSize( width, height, false );
      }
      return needResize;
   }

   render(now: number): void {
      // convert to seconds
      this.now = now * 0.001;
      // make sure delta time isn't too big.
      this.data.deltaTime = Math.min( this.now - this.then, 1 / 20 );


      this.sma.addData(1/this.data.deltaTime);

      this.then = this.now;

      if ( this.resizeRendererToDisplaySize( this.data.renderer ) ) {

         const canvas = this.data.renderer.domElement;
         this.data.camera.aspect = canvas.clientWidth / canvas.clientHeight;
         this.data.camera.updateProjectionMatrix();

      }

      // States the ui could be in:
      // drag to place input, drag to place output,
      this.pick()

      if (this.data.dragLayer) {
        this.intersectPlane()
      }

      this.data.entityManager.update();
      this.data.inputManager.update();
      TWEEN.update()
      

      this.data.renderer.render( this.data.scene, this.data.camera );
      if (this.needCameraFit) {
        this.fitCameraToScene()
        this.needCameraFit = false

      }

      requestAnimationFrame( this.render.bind(this) );
   }

   startRender(): void {
      requestAnimationFrame( this.render.bind(this) );
   }
}
