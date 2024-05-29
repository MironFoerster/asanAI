import { RenderData } from "../../services/render.service";
import { Entity } from "./entity";
import { SafeArray } from "./safe-array";
import * as THREE from 'three';

export class EntityManager {
    entities: SafeArray
    constructor() {

        this.entities = new SafeArray();

    }
    createEntity( data: RenderData, parent: THREE.Object3D, name: string ) {
        console.log(data)
        const gameObject = new Entity(data,parent, name );
        this.entities.add( gameObject );
        return gameObject;

    }
    removeEntity( entity: Entity ) {

        this.entities.remove( entity );
        entity.removeSelf()

    }
    resetScene() {
        this.entities = new SafeArray();
    }
    update() {

        this.entities.forEach( entity => entity.update() );

    }

}