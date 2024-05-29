import { RenderData, RenderService } from "../../../services/render.service";
import { RenderLayer } from "../data-types";
import { Entity } from "../entity";
import { CoroutineRunner } from "../coroutine-runner";
import { Feature } from "../feature";
import * as THREE from 'three';
import { interpolate } from "../../../utils/interpolate";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'


export class LayerLabel extends Feature {
    material: THREE.Material
    layerName: string
    layerType: string
    loader : FontLoader

    constructor(entity: Entity, layerName: string, layerType: string) {
        super(entity)
        this.entity = entity;
        this.layerName = layerName
        this.layerType = layerType
        this.material = new THREE.MeshStandardMaterial({
            color: 0x00ff00, // Your desired color
            roughness: 0.1, // Adjust roughness for the desired effect
            metalness: 0.75, // Higher metalness for a shinier appearance
        });
        

        // Load a font
        this.loader = new FontLoader();
        this.loader.load('assets/fonts/TitilliumWeb_Regular.json', (font) => {
            let geometry: TextGeometry
            let mesh: THREE.Mesh
            geometry = new TextGeometry(this.layerName, {
                font: font,
                size: 2,
                depth: 1,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            });
            geometry.center();
            mesh = new THREE.Mesh(geometry, this.material);
            mesh.position.set(0, -7, 0);
            this.entity.transform.add(mesh);

            geometry = new TextGeometry(this.layerName, {
                font: font,
                size: 2,
                depth: 1,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 8,
                bevelOffset: 0,
                bevelSegments: 5
            });
            geometry.center();
            mesh = new THREE.Mesh(geometry, this.material);
            mesh.position.set(0, -7, 0);
            this.entity.transform.add(mesh);
        });
    }

    override update() {
    }
}