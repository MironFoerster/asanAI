import { Entity } from "./entity";
import { RenderData, RenderService } from "../../services/render.service";
import { inject } from "@angular/core";
import { StateMachine } from "./state-machine";

export class Feature {
    entity: Entity
    stateMachine!: StateMachine
    
    constructor(entity: Entity, ...args: any[]) {
        this.entity = entity;
    }
    update() {
    }

}