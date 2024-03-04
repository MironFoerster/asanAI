import { LabDetails } from "./lab-details";
import { Model } from "./model";
import { Pipe } from "./pipe";

export class Lab {
    name: string = "anonymous";
    id: string | null = null;
    model?: Model;
    pipe?: Pipe;
    details?: LabDetails
}