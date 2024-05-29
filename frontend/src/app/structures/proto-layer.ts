import { serialization } from "@tensorflow/tfjs";

export class ProtoLayer {
    name: string
    type: string
    inputs: Set<number>
    outputs: Set<number>
    config: serialization.ConfigDict
    constructor(name: string, type: string, inputs: Set<number>, outputs: Set<number>, config: serialization.ConfigDict) {
      this.name = name
      this.type = type
      this.inputs = inputs
      this.outputs = outputs
      this.config = config
    }

    static clone(protoLayer: ProtoLayer): ProtoLayer {
      return new ProtoLayer(
          protoLayer.name,
          protoLayer.type,
          new Set([...protoLayer.inputs]),
          new Set([...protoLayer.outputs]),
          {...protoLayer.config } // Assuming serialization.ConfigDict can be cloned this way
      );
    }
  }

  export interface ProtoLayers {
    [key: number]: ProtoLayer
}