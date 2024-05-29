import { Lab } from "./lab";
import { Model } from "./model";
import { Pipe } from "./pipe";
import { Trainer } from "./trainer";

export interface LabData {
    "lab": Lab
    "model": Model
    "pipe": Pipe
    "trainer": Trainer
}