import { ProtoLayer } from "../structures/proto-layer";

export interface Cloneable {
    [key: string]: any;
}

export function deepClone(obj: any): Cloneable {
    if (obj === null || typeof obj!== "object") return obj;
    let clone: Cloneable = Array.isArray(obj)? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] instanceof Set) {
                clone[key] = [...obj[key]];
            } else if (typeof obj[key] === "object" && obj[key]!== null) {
                // Use the clone method for ProtoLayer instances
                if (obj[key] instanceof ProtoLayer) {
                    clone[key] = ProtoLayer.clone(obj[key]);
                } else {
                    clone[key] = deepClone(obj[key]);
                }
            } else {
                clone[key] = obj[key];
            }
        }
    }
    return clone;
}