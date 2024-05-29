import { RenderData, RenderService } from "../../../services/render.service";
import { RenderLayer } from "../data-types";
import { Entity } from "../entity";
import { CoroutineRunner } from "../coroutine-runner";
import { Feature } from "../feature";
import * as THREE from 'three';
import { interpolate } from "../../../utils/interpolate";
import { StateMachine } from "../state-machine";
import TWEEN from '@tweenjs/tween.js';


export class Indicator extends Feature {
    geometry: THREE.SphereGeometry
    material: THREE.MeshStandardMaterial
    mesh: THREE.Mesh
    override stateMachine: StateMachine

    constructor(entity: Entity) {
        super(entity)
        this.entity = entity;
        this.geometry = new THREE.SphereGeometry(2, 20, 20);
        this.material = new THREE.MeshStandardMaterial({
            color: 0x0000ff, // Your desired color
            roughness: 0.1, // Adjust roughness for the desired effect
            metalness: 0.75, // Higher metalness for a shinier appearance
            opacity: 0.6,
            depthTest: false,
            transparent: true
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.entity.transform.add(this.mesh);
        
        const hit_geometry = new THREE.SphereGeometry(7, 10, 10);
        const hit_material = new THREE.MeshStandardMaterial({transparent: true, opacity: 0});
        const hit_mesh = new THREE.Mesh(hit_geometry, hit_material);
        hit_mesh.renderOrder = 999
        this.entity.transform.add(hit_mesh);

        this.stateMachine = new StateMachine({
            off: {
                enter: () => {
                    this.mesh.scale.set(0, 0, 0);
                    this.mesh.scale.set(0, 0, 0);
                },
                update: () => {}
            },
            transOn: {
                enter: () => {
                    this.entity.transform.scale.set(1, 1, 1);
                    new TWEEN.Tween(this.mesh.scale).to(new THREE.Vector3(1, 1, 1), 200)
                        .easing(TWEEN.Easing.Back.Out)
                        .onComplete(() => {
                    this.stateMachine.transition("on")
                    }).start();
                },
                update: () => {
                }
            },
            on: {
                enter: () => {
                    this.entity.transform.scale.set(1, 1, 1);
                    this.mesh.scale.set(1, 1, 1);
                },
                update: () => {
                    if (this.entity.transform == this.entity.data.pickedObject?.parent) {
                        this.stateMachine.transition("transActive")
                    }
                }
            },
            transOff: {
                enter: () => {
                    this.entity.transform.scale.set(1, 1, 1);
                    new TWEEN.Tween(this.mesh.scale).to(new THREE.Vector3(0, 0, 0), 200)
                        .easing(TWEEN.Easing.Quadratic.In)
                        .onComplete(() => {
                    this.stateMachine.transition("off")
                    }).start();
                },
                update: () => {}
            },
            transActive: {
                enter: () => {
                    var tween = new TWEEN.Tween(this.mesh.scale).to(new THREE.Vector3(1.5, 1.5, 1.5), 200)
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
                    this.mesh.scale.set(1.5, 1.5, 1.5);   
                },
                update: () => {
                    if (!(this.entity.transform == this.entity.data.pickedObject?.parent)) {
                        this.stateMachine.transition("transOn")
                    }
                }
            },
        }, "off")
    }

    override update() {
        if ( this.entity.transform == this.entity.data.pickedObject?.parent) {
            this.material.color.setRGB(1, 0, 0)
        } else {
            this.material.color.setRGB(0, 0, 1)
        }
        this.stateMachine.update()
    }
}