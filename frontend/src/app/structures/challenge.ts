import { AgendaTask } from "./agenda-task";

export class Lesson implements AgendaTask {
    constructor(
        public title: string,
        public description: string,
    ) {}
   }