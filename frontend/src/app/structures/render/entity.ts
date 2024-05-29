import * as THREE from 'three';
import { Feature } from './feature';
import { RenderData } from '../../services/render.service';

export class Entity {
    name: string
    features: Feature[]
    transform: THREE.Object3D
    data: RenderData
    parent: THREE.Object3D

    constructor( data: RenderData, parent: THREE.Object3D, name: string ) {
        console.log(data)
        this.data = data;
        this.name = name;
        this.features = [];
        this.transform = new THREE.Object3D();
        this.transform.name = name;
        this.parent = parent
        this.parent.add( this.transform );

    }
    addFeature<T extends Feature>(constructor: new (...args: any[]) => T, ...args: any[]): T {
        const feature = new constructor( this, ...args );
        this.features.push( feature );
        return feature;

    }
    removeFeature( feature: Feature ) {
        const ndx = this.features.indexOf( feature );
        if ( ndx >= 0 ) {

            this.features.splice( ndx, 1 );

        }
    }

    removeSelf() {
        this.parent.remove(this.transform)
    }

    update() {

        for ( const feature of this.features ) {

            feature.update();

        }

    }

}