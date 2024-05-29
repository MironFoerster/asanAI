import { serialization } from "@tensorflow/tfjs";
import { ProtoLayer } from "../proto-layer";
import * as THREE from 'three';


export interface RenderLayer {
    position: THREE.Vector3
    layerId: number
  }
  
export interface RenderLayers {
    [key: number]: RenderLayer
}

export function deepCopyRenderLayers(layers: RenderLayers): RenderLayers {
    const copiedLayers: RenderLayers = {};
    for (const key in layers) {
        if (layers.hasOwnProperty(key)) {
            copiedLayers[key] = {...layers[key], position: new THREE.Vector3(layers[key].position.x, layers[key].position.y, layers[key].position.z) };
        }
    }
    return copiedLayers;
}
  
  
export interface RenderEdge {
    fromId: number,
    toId: number,
    origin: THREE.Vector3,
    points: THREE.Vector3[],
    }

export interface RenderEdges {
    // inputLayerId
    [key: number]: {
        // outputLayerId
        [key: number]: RenderEdge
    }
}

export function deepCopyRenderEdges(edges: RenderEdges): RenderEdges {
    const copiedEdges: RenderEdges = {};
    for (const inputLayerId in edges) {
        if (edges.hasOwnProperty(inputLayerId)) {
            copiedEdges[inputLayerId] = {};
            for (const outputLayerId in edges[inputLayerId]) {
                if (edges[inputLayerId].hasOwnProperty(outputLayerId)) {
                    copiedEdges[inputLayerId][outputLayerId] = {
                       ...edges[inputLayerId][outputLayerId],
                        origin: new THREE.Vector3(edges[inputLayerId][outputLayerId].origin.x, edges[inputLayerId][outputLayerId].origin.y, edges[inputLayerId][outputLayerId].origin.z),
                        points: edges[inputLayerId][outputLayerId].points.map(point => new THREE.Vector3(point.x, point.y, point.z))
                    };
                }
            }
        }
    }
    return copiedEdges;
}
