import { Entity } from "./entity";

export class SafeArray {
    array: Entity[]
    addQueue: Entity[]
    removeQueue: Set<Entity>

    constructor() {

        this.array = [];
        this.addQueue = [];
        this.removeQueue = new Set();

    }
    get isEmpty() {

        return this.addQueue.length + this.array.length > 0;

    }
    add( entity: Entity ) {

        this.addQueue.push( entity );

    }
    remove( entity: Entity ) {

        this.removeQueue.add( entity );

    }
    forEach( fn: (entity: Entity) => void ) {

        this._addQueued();
        this._removeQueued();
        for ( const element of this.array ) {

            if ( this.removeQueue.has( element ) ) {

                continue;

            }

            fn( element );

        }

        this._removeQueued();

    }
    _addQueued() {

        if ( this.addQueue.length ) {

            this.array.splice( this.array.length, 0, ...this.addQueue );
            this.addQueue = [];

        }

    }
    _removeQueued() {

        if ( this.removeQueue.size ) {

            this.array = this.array.filter( element => ! this.removeQueue.has( element ) );
            this.removeQueue.clear();

        }

    }

}