import { Details } from "./details";

export class ModelDetails implements Details {
    constructor(
        public id: string,
        public modelCategory: string, // "basic", "tfjs-pretrained", ?
        public modelUrl: string,
        public title: string,
        public summary: string,
        public description: string,
        public thumbnailUrl: string,
        public stats: object
    ) {}
   }