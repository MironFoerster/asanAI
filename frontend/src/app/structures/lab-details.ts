import { Details } from "./details";

export class LabDetails implements Details {
    constructor(
        public id: string,
        public access_level: string,
        public username: string,
        public name: string,
        public title: string,
        public modelId: string,
        public pipeId: string,
        public summary: string,
        public description: string,
        public thumbnailUrl: string,
        public stats: object
    ) {}
   }