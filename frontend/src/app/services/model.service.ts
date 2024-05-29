import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Model } from '../structures/model';
import { ProtoLayer, ProtoLayers } from '../structures/proto-layer';
import { Layer } from '../structures/layer';
import * as tf from '@tensorflow/tfjs';
import { serialization, Shape } from '@tensorflow/tfjs';
import { Node as TfNode } from '@tensorflow/tfjs-layers/dist/engine/topology';
import { LAYERS } from '../constants/layers';
import { deepCopyRenderEdges, deepCopyRenderLayers, RenderEdges, RenderLayer, RenderLayers } from '../structures/render/data-types';
import { RenderService } from './render.service';
import { Cloneable, deepClone } from '../utils/deep-clone';
import * as THREE from 'three';
import { nameLayer } from '../utils/name-layer';
import path from 'path';



// class Node {
//   id: number;
//   inboundLayers: tf.layers.Layer[]
//   outboundLayer: tf.layers.Layer

//   constructor(id: number, inboundLayers: tf.layers.Layer[], outboundLayer: tf.layers.Layer) {
//     this.id = id
//     this.inboundLayers = inboundLayers
//     this.outboundLayer = outboundLayer
//   }
//  }


 
 class NodesByDepth {
  [depth: string]: TfNode[];
 }

 type LayerPath = number[][] //list of list when single path, list of lists when multiple equally long paths
 

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  data: Model = new Model();
  layersModel!: tf.LayersModel;
  protoLayers: ProtoLayers = {};
  maxId: number = 0;
  layerIdOrder: number[] = []
  api = inject(ApiService)
  renderer = inject(RenderService)

  composeNodesByDepth(layers: tf.layers.Layer[]) {
    const nodesByDepth = new NodesByDepth()
    nodesByDepth[0] = []
    const foundNodes: number[] = []

    for (let layer of layers) {
      console.log(layer)
      console.log(layer.inboundNodes)
      layer.inboundNodes.forEach((node) => {
        console.log("enter")
        if (!foundNodes.includes(node.id)) {
          foundNodes.push(node.id)
          console.log ("find")
          // const newNode = new Node(node.id, node.inboundLayers, node.outboundLayer)
          nodesByDepth[0].push(node)
        }
      })
    }
    console.log(nodesByDepth)
    return nodesByDepth
  }

  extractProto(layers: tf.layers.Layer[], nodesByDepth: NodesByDepth): ProtoLayers {
    let protoLayers: ProtoLayers = [];

    if (layers[0].getClassName() !== 'InputLayer') {
      layers.unshift(layers[0].inboundNodes[0].inboundLayers[0])
    }


    for (let layer of layers) {
      const protoLayer = new ProtoLayer(
        layer.name,
        layer.getClassName(),
        new Set<number>(),
        new Set<number>(),
        layer.getConfig()
      )

      // extract inputs and outputs
      for (let depth in nodesByDepth) {
        for (let node of nodesByDepth[depth]) {
          const inboundIds = node.inboundLayers.map(layer => layer.id);
          const outboundId = node.outboundLayer.id;

          if (outboundId == layer.id) {
            protoLayer.inputs = new Set<number>([...protoLayer.inputs, ...inboundIds])
          }
          if (inboundIds.includes(layer.id)) {
            protoLayer.outputs.add(outboundId)
          }
        }
      }
      protoLayers[layer.id] = protoLayer
    }
    return protoLayers
  }

  findLongestPaths(unusedProtoLayers: ProtoLayers, layerIds: Set<number>): number[][] {
    let longestPaths: number[][] = [];
   
    function dfs(layerId: number, visited: Set<number>, path: number[]): void {
      console.log("DDDDFFFFSSS")
      console.log(layerId)
      console.log(visited)
      console.log(path)
      console.log(JSON.parse(JSON.stringify(unusedProtoLayers)))

       visited.add(layerId);
       path.push(layerId);
       
      console.log(unusedProtoLayers[layerId].outputs)
      console.log(unusedProtoLayers[layerId].inputs)

       if (unusedProtoLayers[layerId].outputs.size == 0) {
        console.log("is longest!!!")
         // If this path is longer than the current longest, update longestPaths
         if (longestPaths.length === 0 || path.length > longestPaths[0].length) {
           longestPaths = [path.slice()]; // Create a copy of the path
         } else if (path.length === longestPaths[0].length) {
           // If the path is equal length to the current longest, add it to the list
           longestPaths.push(path.slice());
         }
         console.log(longestPaths)
       } else {
        
         // Explore all outputs from the current node
         for (const output of [...unusedProtoLayers[layerId].outputs]) {
          console.log("going")
          console.log(output)
           if (!visited.has(output)) {
             dfs(output, visited, path);
           } else {
            console.log("visited")
           }
         }
       }
       console.log(path.pop())
       console.log(path)
       visited.delete(layerId);
       return
    }
   
    // Start DFS from each start node
    console.log(layerIds)
    for (const layerId of layerIds) {
      if (!unusedProtoLayers[layerId]) {continue}
       dfs(layerId, new Set(), []);
    }
    return longestPaths;
   }

   extractPathStructure(): LayerPath[] {
    let startLayerId = Number(Object.keys(this.protoLayers).find(key => this.protoLayers[Number(key)].inputs.size == 0))
    let endLayerId = Number(Object.keys(this.protoLayers).find(key => this.protoLayers[Number(key)].outputs.size == 0))
    let visitedIds: Set<number> = new Set<number>([startLayerId, endLayerId])
    console.log(this.protoLayers)
    const unusedProtoLayers: ProtoLayers = deepClone(this.protoLayers)
    console.log(unusedProtoLayers)
    const layerPaths: LayerPath[] = []
    while (Object.keys(unusedProtoLayers).length > 0) {
      let longestPaths = this.findLongestPaths(unusedProtoLayers, visitedIds)
      longestPaths = [longestPaths[0]] // no parallel/equal length specialtreatment
      visitedIds = new Set<number>([...visitedIds, ...longestPaths.flat()])
      for (let path of longestPaths) {
        for (let iString in path) {
          let i: number = parseInt(iString)
          let layerId = path[i]
          if (unusedProtoLayers[layerId].outputs.size <= 1 && unusedProtoLayers[layerId].inputs.size <= 1) {
            delete unusedProtoLayers[layerId]
          } else {
            unusedProtoLayers[layerId].outputs.delete(path[i+1])
            unusedProtoLayers[layerId].inputs.delete(path[i+-1])
          }
        }
      }

      layerPaths.push(longestPaths)
    }
    return layerPaths
   }

   findPathClustersO(availablePaths: LayerPath[], layerIds: number[]): Set<number>[] {
    let pathClusters: Set<number>[] = []
    layerIds.forEach((id) => {
      // check if appears as start or end layer in any available Path, else deletes
      if (!availablePaths.some(path => path[0][0] == id || path[0][path[0].length-1] == id)) {
        layerIds.splice(id, 1)
      }
    })
    while (layerIds.length) {

      let cluster: Set<number> = new Set<number>()
      let visitedIds: Set<number> = new Set<number>()

      const flood = (layerId: number) => {
        if (visitedIds.has(layerId)) {
          return
        }

        visitedIds.add(layerId)

        for (let pathIdx in availablePaths) {

          if (availablePaths[pathIdx][0][0] == layerId) {

            cluster.add(Number(pathIdx))

            for (let layerIdx in availablePaths[pathIdx][0].slice(1)) {
              flood(availablePaths[pathIdx][0][layerIdx])
            }
          }

          if (availablePaths[pathIdx][0][availablePaths[pathIdx][0].length-1] == layerId) {

            cluster.add(Number(pathIdx))

            for (let layerIdx in availablePaths[pathIdx][0].slice(1)) {
              flood(availablePaths[pathIdx][0][layerIdx])
            }
          }
        }
      }
      flood(layerIds[0])
      pathClusters.push(cluster)
    }
    return pathClusters
   }

   findPathClustersOO(availablePaths: LayerPath[]): Set<number>[] {
    let pathClusters: Set<number>[] = []
    let tempCluster: Set<number> = new Set<number>()

    const flood = (floodPathIdx: number) => {

      // check if cluster has already been flooded
      if (pathClusters.some(cluster => cluster.has(floodPathIdx)) || tempCluster.has(floodPathIdx)) {
        return
      }
      tempCluster.add(Number(floodPathIdx))

      for (let layerIdx in availablePaths[floodPathIdx][0]) {
        for (let pathIdx in availablePaths.slice(1, availablePaths[floodPathIdx][0].length-1)) {

          if (availablePaths[pathIdx][0][0] == availablePaths[floodPathIdx][0][layerIdx] || availablePaths[pathIdx][0][availablePaths[pathIdx][0].length-1] == availablePaths[floodPathIdx][0][layerIdx]) {
            flood(Number(pathIdx))
          }
        }
      }
    }
    
    // initiate flood from every root-path-layer
    for (let layerIdx in availablePaths[0][0]) {
      // check every available path for starting or ending on the current layer
      for (let pathIdx in availablePaths) {
        if (availablePaths[pathIdx][0][0] == availablePaths[0][0][layerIdx] || availablePaths[pathIdx][0][availablePaths[pathIdx][0].length-1] == availablePaths[rootPathIdx][0][layerIdx]) {
          //flood the path and its connected cluster
          flood(Number(pathIdx))

          // if it found a still unflooded cluster
          if (tempCluster.size) {
            // push the builtup cluster
            pathClusters.push(tempCluster)
            tempCluster = new Set<number>()
          }
        }
      }
    }
    return pathClusters
   }

   findPathClusters(availablePaths: LayerPath[], isFirst: boolean = false): Set<number>[] {
    let pathClusters: Set<number>[] = []
    let tempCluster: Set<number> = new Set<number>()

    const flood = (floodPathIdx: number) => {

      // check if path has already been flooded
      if (pathClusters.some(cluster => cluster.has(floodPathIdx)) || tempCluster.has(floodPathIdx)) {
        return
      }
      tempCluster.add(Number(floodPathIdx))

      for (let layerIdx in availablePaths[floodPathIdx][0]) {
        for (let pathIdx in availablePaths.slice(1, availablePaths[floodPathIdx][0].length-1)) {

          if (availablePaths[pathIdx][0][0] == availablePaths[floodPathIdx][0][layerIdx] || availablePaths[pathIdx][0][availablePaths[pathIdx][0].length-1] == availablePaths[floodPathIdx][0][layerIdx]) {
            flood(Number(pathIdx))
          }
        }
      }
    }

    let allowedStartLayers = []
    if (isFirst) {
      allowedStartLayers = availablePaths[0][0].slice()
    } else {
      allowedStartLayers = availablePaths[0][0].slice(1, availablePaths[0][0].length-1)
    }

    // initiate flood from every root-path-layer
    for (let layerIdx in allowedStartLayers) {
      // check every available path for starting or ending on the current layer
      for (let pathIdx in availablePaths) {
        if (availablePaths[pathIdx][0][0] == availablePaths[0][0][layerIdx] || availablePaths[pathIdx][0][availablePaths[pathIdx][0].length-1] == availablePaths[0][0][layerIdx]) {
          //flood the path and its connected cluster
          flood(Number(pathIdx))

          // if it found a still unflooded cluster
          if (tempCluster.size) {
            // push the builtup cluster
            pathClusters.push(tempCluster)
            tempCluster = new Set<number>()
          }
        }
      }
    }
    return pathClusters
   }

   findPathsClusters(layerPaths: LayerPath[]): Set<number>[][] {
    let pathsClusters: Set<number>[][] = []
    let availableLayerPaths: LayerPath[] = [...layerPaths]
    let first = true
    for (let pathIdx in layerPaths) {
      let offsetIdClusters = this.findPathClusters(availableLayerPaths, first)//, Number(pathIdx))//[...new Set(layerPaths[pathIdx].flat())])
      pathsClusters.push(offsetIdClusters.map(clusterIds => new Set<number>([...clusterIds].map(id => id+Number(pathIdx)))))
      first = false
    }
    return pathsClusters
   }

   createPathsClustersSpecs(layerPaths: LayerPath[]) {
    const pathsClustersSpecs: {inside: Set<number>[], outside: Set<number>[]}[] = []

    const pathsClusters: Set<number>[][] = this.findPathsClusters(layerPaths)
    console.log("pathsClusters")
    console.log(pathsClusters)

    // create cluster specs (which outside, which inside)
    for (let pathClusters of pathsClusters) {
      let clustersSpecs: {inside: Set<number>[], outside: Set<number>[]} = {inside: [], outside: []}
      
      let clusterCounter: number = 0
      for (let cluster of pathClusters) {
        if (clusterCounter % 2 == 0) {
          clustersSpecs.outside.push(cluster)
        } else {
          clustersSpecs.inside.push(cluster)
        }
        clusterCounter += 1

        for (let pathIdx in layerPaths) {
          if (cluster.has(Number(pathIdx))) {
            
          }
        }
      }
      pathsClustersSpecs.push(clustersSpecs)
    }
    return pathsClustersSpecs
   }

   arrangePathRenderLayers(layerPath: LayerPath, level: number, left: number, right: number): RenderLayers {
    let renderLayers: RenderLayers = {}
    let pathLength = layerPath[0].length
    let gap: number = (right - left)/(pathLength-1) // -2 (first and last) +1 (more gaps than nodes)
    console.log(gap)
    let x_acc: number = left
    for (let layerId of layerPath[0].slice(1, pathLength-1)) {
      console
      x_acc += gap
      let renderLayer: RenderLayer = {
        position: new THREE.Vector3(x_acc, level, 0),
        layerId: layerId
      }
      renderLayers[layerId] = renderLayer
    }
    console.log("renderLayersSINGLE")
    console.log(renderLayers)
    return renderLayers
   }

   arrangeRenderLayers(layerPaths: LayerPath[], pathsClustersSpecs: {inside: Set<number>[], outside: Set<number>[]}[]): RenderLayers{
    let renderLayers: RenderLayers = {}

    // add first path layers
    let gap: number = 20
    let x_acc: number = 0
    for (let layerId of layerPaths[0][0]) {
      x_acc += gap
      let renderLayer: RenderLayer = {
        position: new THREE.Vector3(x_acc, 0, 0),
        layerId: layerId
      }
      renderLayers[layerId] = renderLayer
    }
    console.log("wdfsdfsdfsdfsdfsdfsdfsfdsdfdfdddddddd")
    console.log("renderLayers")
    console.log(renderLayers)
    console.log("pathsClustersSpecs")
    console.log(pathsClustersSpecs)
    console.log("layerPaths")
    console.log(layerPaths)

    // add remaining paths layers
    let globalFactor = 1
    let localFactor = 1
    let rootOffset = 0
    let tempOffset = 0
    for (let pathIdx in layerPaths) {
      if (Number(pathIdx) == 0) {continue}
      if (layerPaths[pathIdx][0].length <= 2) {continue}

      // get if above or below center (above is outside)
      if (pathsClustersSpecs[0].outside.some(cluster => cluster.has(Number(pathIdx)))) {
        globalFactor = 1
      } else {
        globalFactor = -1
      }

      // get if path index in inside or outside cluster-root-path, and offset from cluster root path
      console.log(Number(pathIdx)-1)
      for (let clustersIdx = Number(pathIdx)-1; clustersIdx >= 0; clustersIdx--) {
        console.log(clustersIdx)
        console.log(pathsClustersSpecs[clustersIdx])
        tempOffset = pathsClustersSpecs[clustersIdx].outside.findIndex(cluster => cluster.has(Number(pathIdx)))
        if (tempOffset>-1) {
          localFactor = 1
          rootOffset = tempOffset +1
          break
        }
        tempOffset = pathsClustersSpecs[clustersIdx].inside.findIndex(cluster => cluster.has(Number(pathIdx)))
        if (tempOffset>-1) {
          localFactor = -1
          rootOffset = tempOffset +1
          break
        }
      }
      console.log("rootOffset")
      console.log(rootOffset)
      console.log("localFactor")
      console.log(localFactor)
      console.log("globalFactor")
      console.log(globalFactor)
      renderLayers = {...renderLayers, ...this.arrangePathRenderLayers(layerPaths[pathIdx], renderLayers[layerPaths[pathIdx][0][0]].position.y + (globalFactor*localFactor*rootOffset*20), renderLayers[layerPaths[pathIdx][0][0]].position.x, renderLayers[layerPaths[pathIdx][0][layerPaths[pathIdx][0].length-1]].position.x)}
    }
    console.log(renderLayers)
    return renderLayers
   }

   computeRenderEdges(renderLayers: RenderLayers, layerPaths: LayerPath[], protoLayers: ProtoLayers, pathsClustersSpecs: {inside: Set<number>[], outside: Set<number>[]}[]) {
    let renderEdges: RenderEdges = {}
    let skipPathOffsets: {[key: number]: {[key: number]: number}} = {}

    // find connection paths (only 2 layers)
    let globalFactor = 1
    let localFactor = 1
    let rootOffset = 0
    let tempOffset = 0
    for (let pathIdx in layerPaths) {
      console.log(layerPaths[pathIdx])
      // if skip connection
      if (layerPaths[pathIdx][0].length > 2) {continue}
      console.log(layerPaths[pathIdx])
      // if
      if (!(renderLayers[layerPaths[pathIdx][0][0]].position.y == renderLayers[layerPaths[pathIdx][0][1]].position.y)) {continue}
      console.log(layerPaths[pathIdx])
      if (pathsClustersSpecs[0].outside.some(cluster => cluster.has(Number(pathIdx)))) {
        globalFactor = 1
      } else {
        globalFactor = -1
      }

      for (let clustersIdx; clustersIdx = Number(pathIdx)-1; clustersIdx--) {
        tempOffset = pathsClustersSpecs[clustersIdx].outside.findIndex(cluster => cluster.has(Number(pathIdx)))
        if (tempOffset>-1) {
          localFactor = 1
          rootOffset = tempOffset
          break
        }
        tempOffset = pathsClustersSpecs[clustersIdx].inside.findIndex(cluster => cluster.has(Number(pathIdx)))
        if (tempOffset>-1) {
          localFactor = -1
          rootOffset = tempOffset
          break
        }
      }
      if (!skipPathOffsets[layerPaths[pathIdx][0][0]]) {
        skipPathOffsets[layerPaths[pathIdx][0][0]] = {};
      }
      skipPathOffsets[layerPaths[pathIdx][0][0]][layerPaths[pathIdx][0][1]] = rootOffset+globalFactor*localFactor*rootOffset*0.5
    }

    console.log(skipPathOffsets)
    console.log("AASADSFASDFASASFASFASF")

    for (let layerId in protoLayers) {
      for (let outputId of protoLayers[layerId].outputs) {
        const points: THREE.Vector3[] = []
        if (!skipPathOffsets[layerId]) {
          skipPathOffsets[layerId] = {};
        }

        // push curve points as vectors
        points.push(new THREE.Vector3(renderLayers[layerId].position.x, renderLayers[layerId].position.y, 0))
        const offset = skipPathOffsets[layerId][outputId]
        if (offset) {
          points.push(new THREE.Vector3(renderLayers[layerId].position.x + (renderLayers[outputId].position.x - renderLayers[layerId].position.x) / 2, offset*10, 0))
        }
        points.push(new THREE.Vector3(renderLayers[outputId].position.x, renderLayers[outputId].position.y, 0))

        if (points.length % 2 == 0) {
          const curve = new THREE.CatmullRomCurve3( points );
          const middlePoint: THREE.Vector3 = curve.getPointAt(0.5)
          points.splice(points.length/2, 0, middlePoint)
        }

        const origin: THREE.Vector3 = new THREE.Vector3()
        origin.copy(points[Math.floor(points.length/2)])

        const transformedPoints = points.map((point)=>{return point.sub(origin)})

        if (!renderEdges[layerId]) {
          renderEdges[layerId] = {};
        }
        renderEdges[layerId][outputId] = {
          fromId: Number(layerId),
          toId: outputId,
          origin: origin,
          points: transformedPoints,
        }
      }
    }
    return renderEdges
   }

   addProtoLayer(type: string,
    inputs: Set<number>,
    outputs: Set<number>,
    config: serialization.ConfigDict) {
      console.log("prUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUotoLayers")
      
      const allIds: number[] = Object.keys(this.protoLayers).map((i:string)=>Number(i)).sort((a, b) => a - b)
      console.log(allIds)
      let newId: number = allIds[allIds.length-1] + 1
      console.log(newId)
      this.protoLayers[newId] = new ProtoLayer(nameLayer(type, this.protoLayers), type, inputs, outputs, config)
      for (let inputId of inputs) {
        this.protoLayers[inputId].outputs.add(newId)
      }
      for (let outputId of outputs) {
        this.protoLayers[outputId].inputs.add(newId)
      }
      // update layerIdOrder
      let i = 0
      for (let inputId of inputs) {
        i = Math.max(this.layerIdOrder.indexOf(inputId), i)
      }
      this.layerIdOrder.splice(i+1, 0, Number(newId))
      console.log(JSON.parse(JSON.stringify(this.protoLayers)))
      return newId
   }
   initLayerIdOrder() {
    const visited = new Set<number>();

    const dfs = (layerId: number) => {
        visited.add(layerId);

        // Find the layer with the given ID
        const layer = this.protoLayers[layerId];
        if (!layer) {
            throw new Error(`Layer with ID ${layerId} not found`);
        }

        // Visit all input nodes
        for (const inputId of layer.inputs) {
            if (!visited.has(inputId)) {
                dfs(inputId);
            }
        }

        // Push the node to the stack after visiting all its inputs
        this.layerIdOrder.push(layerId);
    }
    // Perform DFS from each node that has no incoming edges
    for (let layerId of Object.keys(this.protoLayers)) {
        let id = parseInt(layerId)
        if (this.protoLayers[id].outputs.size === 0 && !visited.has(id)) {
            dfs(id);
        }
    }
}

   build() {
    let inputId: number = 0
    let outputId: number = 0
    const buildLayers: { [key: number]: tf.SymbolicTensor } = {};
    this.initLayerIdOrder()
    for (let layerId of this.layerIdOrder) {
      const protoLayer = this.protoLayers[layerId] as ProtoLayer;
      
      if (protoLayer.type.toLowerCase() == "inputlayer") {
        inputId = layerId
        buildLayers[layerId] = tf.input({batchShape: protoLayer.config['batchInputShape'] as Shape})
      } else {
        if (protoLayer.outputs.size == 0) {
          outputId = layerId
        }
        const inputs: tf.SymbolicTensor[] = Array.from(protoLayer.inputs).map(id => buildLayers[id])
        console.log(this.protoLayers)
        console.log(protoLayer.type)
        buildLayers[layerId] = LAYERS[protoLayer.type].fn(protoLayer.config).apply(inputs.length == 1?inputs[0]:inputs) as tf.SymbolicTensor;
      }
    }
    console.log(buildLayers)
    this.layersModel = tf.model({inputs: buildLayers[inputId], outputs: buildLayers[outputId]})
    console.log("INMODEL")
    console.log(this.renderer.data.scene)
  }

  async clone(fromModelId: string) { // TODO: missing version
    this.api.get("get-model/"+fromModelId).subscribe({
      next:  (modelData) => {
        this.data = modelData
      },
      error: (error) => {
        console.log("import model failure")
      }
    })
    this.layersModel = await tf.loadLayersModel("http://localhost:8000/media/"+fromModelId+"/model.json");
  }

  computeGraph(): [RenderLayers, RenderEdges, Cloneable] {
    console.log(this.protoLayers)
    const layerPaths: LayerPath[] = this.extractPathStructure()
    console.log(layerPaths)
    const pathsClustersSpecs = this.createPathsClustersSpecs(layerPaths)
    const renderLayers: RenderLayers = this.arrangeRenderLayers(layerPaths, pathsClustersSpecs)
    const renderEdges: RenderEdges = this.computeRenderEdges(renderLayers, layerPaths, this.protoLayers, pathsClustersSpecs)

    return [deepCopyRenderLayers(renderLayers), deepCopyRenderEdges(renderEdges), deepClone(this.protoLayers)]
  }

  async loadModel(url?:string, files?:[File, File]) {
    console.log("LOADMODEL")
    if (typeof url !== 'undefined') {
      this.layersModel = await tf.loadLayersModel(url);
    } else if (typeof files !== 'undefined') {
      this.layersModel = await tf.loadLayersModel(tf.io.browserFiles(files));
    } else {
      this.layersModel = await tf.loadLayersModel("http://localhost:8000/media/"+this.data.id+"/"+this.data.version.v+"/model.json");
    }
    if (Object.keys(this.layersModel.nodesByDepth).length === 0) {
      this.layersModel.nodesByDepth = this.composeNodesByDepth(this.layersModel.layers)
    }
    this.protoLayers = this.extractProto(this.layersModel.layers, this.layersModel.nodesByDepth as NodesByDepth)
    console.log(this.protoLayers)
    
    this.renderer.buildRender(...this.computeGraph())
    this.build()
  }

  saveModel() {
    this.layersModel.save('http://localhost:8000/api/save-model/'+this.data.id+"/").then(() => {
      console.log('Model saved successfully');
    });
  }

 

  // train() {
  //   this.model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

  //   // Train the model with validation
  //   this.model.fitDataset(trainDataset.map(preprocess), {
  //   epochs: 5,
  //   validationData: validationDataset.map(preprocess),
  //   callbacks: {
  //       onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs.loss}, accuracy = ${logs.acc}, valLoss = ${logs.valLoss}, valAcc = ${logs.valAcc}`)
  //   }
  //   }).then(() => {
  //   console.log('Model training complete.');
  // }




}
