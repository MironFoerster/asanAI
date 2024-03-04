import { AgendaTask } from "./agenda-task";
import { Unit } from "./unit";

export interface Space {
    type: string // program, classroom, hackathon
    name: string
    admin: string
    units: Unit[]
}