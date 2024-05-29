import { ProtoLayers } from "../structures/proto-layer";

export function nameLayer(type: string, protoLayers: ProtoLayers): string {
    let name = type.toLowerCase()+"_"
    let taken: Set<number> = new Set<number>([0])
    for (let layerId in protoLayers) {
        if (protoLayers[layerId].name.startsWith(name)) {
            taken.add(Number(protoLayers[layerId].name.substring(name.length)))
        }
    }
    name += String(Math.max(...taken)+1)
    return name
}