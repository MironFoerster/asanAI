export class Model { //  extends ModelDetails?
    id?: string
    name?: string
    latest_v?: number
    version!: { //TODO: bad, figure out how to do anonymous lab
        v:number
    }
   }