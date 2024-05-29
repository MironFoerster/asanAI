import { LabDetails } from "./lab-details";
import { Model } from "./model";
import { Pipe } from "./pipe";
export class Lab {
    name: string = "Unnamed Lab";
    id: string | null = null;
    model?: Model;
    pipe?: Pipe;
    details?: LabDetails
    authorization?: string
    username?: string 
    version?: LabVersion 
}

export interface LabVersion {
    lab: string
    v: number
    commit_message: string
    timestamp: string
}
