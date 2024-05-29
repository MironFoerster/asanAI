import { Details } from "./details";

export class LabDetails implements Details {
    constructor(
        public id: string,
        public authorization: string,
        public latest_v: number,
        public username: string,
        public name: string,
        public title: string,
        public modelId: string,
        public pipeId: string,
        public model_source: {"id": string, "name": string, "lab": {"id": string, "name": string}},
        public pipe_source: {"id": string, "name": string, "lab": {"id": string, "name": string}},
        public summary: string,
        public description: string,
        public thumbnailUrl: string,
        public stats: object
    ) {}
   }