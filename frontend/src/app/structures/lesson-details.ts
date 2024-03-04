import { Details } from "./details";

export class LessonDetails implements Details {
    constructor(
        public id: string,
        public title: string,
        public summary: string,
        public description: string,
        public thumbnailUrl: string,
        public stats: object
    ) {}
   }