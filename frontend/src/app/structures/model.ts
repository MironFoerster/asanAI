import { ModelDetails } from "./model-details"

export interface Model {
    details: ModelDetails // "basic", "tfjs-pretrained", ?
    modelUrl: string
    summary: string
   }