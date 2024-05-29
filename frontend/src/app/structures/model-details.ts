import { Details } from "./details";

export class ModelDetails implements Details {
    constructor(
        public id: string = "",
        public modelCategory: string = "basic", // "basic", "tfjs-pretrained", ?
        public model_source?: {"id": string, "name": string, "lab": {"id": string, "name": string}},
        public title?: string,
        public description?: string,
        public thumbnailUrl?: string,
        public stats?: object
    ) {}
   }