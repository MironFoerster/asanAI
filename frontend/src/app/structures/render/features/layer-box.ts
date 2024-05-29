import { RenderData, RenderService } from "../../../services/render.service";
import { RenderLayer } from "../data-types";
import { Entity } from "../entity";
import { CoroutineRunner } from "../coroutine-runner";
import { Feature } from "../feature";
import * as THREE from 'three';
import { interpolate } from "../../../utils/interpolate";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { StateMachine } from "../state-machine";
import TWEEN from '@tweenjs/tween.js';


export class LayerBox extends Feature {
    geometry: THREE.BoxGeometry
    material: THREE.MeshStandardMaterial
    mesh: THREE.Mesh
    renderLayer: RenderLayer
    override stateMachine: StateMachine


    constructor(entity: Entity, renderLayer: RenderLayer, stateInit: string = "off") {
        super(entity)
        this.entity = entity;
        this.entity.transform.position.copy(renderLayer.position)

        this.renderLayer = renderLayer
        this.geometry = new RoundedBoxGeometry(10, 10, 10, 4, 2);
        this.material = new THREE.MeshStandardMaterial({
            color: 0x00ff00, // Your desired color
            roughness: 0.1, // Adjust roughness for the desired effect
            metalness: 0.75, // Higher metalness for a shinier appearance
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.entity.transform.add(this.mesh);
        this.stateMachine = new StateMachine({
            off: {
                enter: () => {
                    this.mesh.scale.set(0, 0, 0);
                },
                update: () => {
                    this.stateMachine.transition("transIdle")
                }
            },
            transIdle: {
                enter: () => {
                    new TWEEN.Tween({scale: this.mesh.scale, pos: this.entity.transform.position}).to({scale: new THREE.Vector3(1, 1, 1), pos: this.entity.data.renderLayers[this.renderLayer.layerId]}, 200)
                        .easing(TWEEN.Easing.Back.Out)
                        .onComplete(() => {
                            this.stateMachine.transition("idle")
                        }).start();
                },
                update: () => {}
            },

            idle: {
                enter: () => {
                    this.mesh.scale.set(1, 1, 1);
                },
                update: () => {
                    if (this.entity.transform == this.entity.data.pickedObject?.parent) {
                        this.stateMachine.transition("transActive")
                    }
                }
            },
            transActive: {
                enter: () => {
                    var tween = new TWEEN.Tween(this.mesh.scale).to(new THREE.Vector3(1.2, 1.2, 1.2), 200)
                        .easing(TWEEN.Easing.Back.Out)
                        .onComplete(() => {
                    this.stateMachine.transition("active")
                    });

                    tween.start();
                },
                update: () => {
                }
            },
            active: {
                enter: () => {
                    this.mesh.scale.set(1.2, 1.2, 1.2);   
                },
                update: () => {
                    if (!(this.entity.transform == this.entity.data.pickedObject?.parent)) {
                        this.stateMachine.transition("transIdle")
                    }
                }
            },
            loading: {
                enter: () => {
                    this.mesh.scale.set(1, 1, 1)
                    new TWEEN.Tween(this.mesh.scale).to(new THREE.Vector3(1.2, 1.2, 1.2), 200)
                        .easing(TWEEN.Easing.Quadratic.In)
                        .repeat().start();
                },
                update: () => {}
            },
            transRemove: {
                enter: () => {
                    new TWEEN.Tween(this.mesh.scale).to(new THREE.Vector3(0, 0, 0), 200)
                        .easing(TWEEN.Easing.Quintic.Out)
                        .onComplete(() => {
                    this.stateMachine.transition("remove")
                    }).start();
                },
                update: () => {}
            },
            remove: {
                enter: () => {
                    this.entity.removeSelf()
                },
                update: () => {}
            },
            transDrag: {
                enter: () => {
                    this.stateMachine.states["transDrag"].startState = {scale: this.mesh.scale.x}
                    this.stateMachine.states["transDrag"].elapsedTime = 0
                },
                update: () => {
                    this.entity.transform.position.copy(this.entity.data.cursorOnPlane)

                    this.stateMachine.states["transDrag"].elapsedTime! += this.entity.data.deltaTime
                    const scale = interpolate(this.stateMachine.states["transDrag"].startState!["scale"],
                    1,
                    0.5,
                    this.stateMachine.states["transDrag"].elapsedTime!,
                    "easeIn")
                    this.mesh.scale.set(scale, scale, scale)
                    if (this.stateMachine.states["transDrag"].elapsedTime! >= 0.5) {
                        this.stateMachine.transition("Drag")
                    };
                }
            },
            drag: {
                enter: () => {
                },
                update: () => {
                    this.entity.transform.position.copy(this.entity.data.cursorOnPlane)
                }
            },
        }, stateInit)
    }

    override update() {
        this.stateMachine.update()
    }
}