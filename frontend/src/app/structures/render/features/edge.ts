import { RenderData, RenderService } from "../../../services/render.service";
import { RenderEdge, RenderLayer } from "../data-types";
import { Entity } from "../entity";
import { CoroutineRunner } from "../coroutine-runner";
import { Feature } from "../feature";
import * as THREE from 'three';
import { interpolate } from "../../../utils/interpolate";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { StateMachine } from "../state-machine";
import TWEEN from '@tweenjs/tween.js';


export class Edge extends Feature {
    geometry: THREE.TubeGeometry
    material: THREE.MeshStandardMaterial
    mesh: THREE.Mesh
    renderEdge: RenderEdge
    curve: THREE.CatmullRomCurve3;
    override stateMachine: StateMachine

    constructor(entity: Entity, renderEdge: RenderEdge, stateInit: string = "off") {
        super(entity)
        this.entity = entity
        this.entity.transform.position.copy(renderEdge.origin)

        this.renderEdge = renderEdge
        console.log(this.renderEdge.points)
        this.curve = new THREE.CatmullRomCurve3(this.renderEdge.points);
        
        // Create the tube geometry
        this.geometry = new THREE.TubeGeometry(this.curve, 20, 1, 8);
        
        // Create the mesh
        this.material = new THREE.MeshStandardMaterial({
            color: 0x0000ff, // Your desired color
            roughness: 0,
            side: THREE.DoubleSide,
            metalness: 0.8,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.entity.transform.add(this.mesh);

        this.stateMachine = new StateMachine({
            off: {
                enter: () => {
                    var newGeometry = new THREE.TubeGeometry(this.curve, 10, 0, 10, false);
                    this.mesh.geometry = newGeometry; // Replace the old geometry with the new one
                    this.mesh.updateMatrix();
                },
                update: () => {
                    this.stateMachine.transition("transOffIdle")
                }
            },
            transOffIdle: {
                enter: () => {
                    new TWEEN.Tween({value: 0}) // Initial value
                    .to({value: 1}, 1000)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onUpdate((radius) => {
                        this.geometry = new THREE.TubeGeometry(this.curve, 10, radius.value, 10);
                        this.mesh.geometry = this.geometry; // Replace the old geometry with the new one
                        this.mesh.updateMatrix();
                    })
                    .onComplete(() => {
                            this.stateMachine.transition("idle")
                        })
                    .start();
                },
                update: () => {}
            },
            transIdleIdle: {
                enter: () => {
                    const points: THREE.Vector3[] = []
                    const len = this.entity.data.renderEdges[this.renderEdge.fromId][this.renderEdge.toId].points.length
                    for (let i = 0; i < len; i++) {
                        points.push(this.curve.getPointAt(i / len))
                    }
                    let properties = {
                        origin: this.entity.transform.position,
                        points: points
                    }
                    let to = {
                        origin: this.entity.data.renderEdges[this.renderEdge.fromId][this.renderEdge.toId].origin,
                        points: this.entity.data.renderEdges[this.renderEdge.fromId][this.renderEdge.toId].points
                    }

                    new TWEEN.Tween(properties) // Initial value
                    .to(to, 500)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate((props) => {
                        this.curve = new THREE.CatmullRomCurve3(props.points)
                        this.geometry = new THREE.TubeGeometry(this.curve, 10, 1, 10);
                        this.mesh.geometry = this.geometry; // Replace the old geometry with the new one
                        this.mesh.updateMatrix();
                    })
                    .onComplete(() => {
                            this.stateMachine.transition("idle")
                        })
                    .start();
                },
                update: () => {}
            },
            idle: {
                enter: () => {
                    this.mesh.scale.set(1, 1, 1);
                },
                update: () => {
                    if (false && this.entity.transform == this.entity.data.pickedObject?.parent) {
                        this.stateMachine.transition("transRemove")
                    }
                }
            },
            transRemove: {
                enter: () => {
                    this.stateMachine.states["transRemove"].startState = {scale: this.mesh.scale.x}
                    this.stateMachine.states["transRemove"].elapsedTime = 0
                },
                update: () => {
                    this.stateMachine.states["transRemove"].elapsedTime! += this.entity.data.deltaTime
                    const scale = interpolate(this.stateMachine.states["transRemove"].startState!["scale"],
                    0,
                    0.5,
                    this.stateMachine.states["transRemove"].elapsedTime!,
                    "easeIn")
                    this.mesh.scale.set(scale, scale, scale)
                    if (this.stateMachine.states["transRemove"].elapsedTime! >= 0.5) {
                        this.stateMachine.transition("remove")
                    };
                }
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