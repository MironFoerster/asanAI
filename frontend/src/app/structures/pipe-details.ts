import { Details } from "./details";

export class PipeDetails implements Details {
    constructor(
        public id: string,
        public sourceType: string, // "minigame", "tfds-record", ?
        public dataCategory: string, // "image", "tabular", "minigame", ?
        public dataUrl: string,
        public title: string,
        public summary: string,
        public description: string,
        public thumbnailUrl: string,
        public stats: object
    ) {}
   }