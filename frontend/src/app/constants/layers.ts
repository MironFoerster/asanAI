import * as tf from '@tensorflow/tfjs';

interface Layers {
    [key: string]: {fn: (args: any) => tf.layers.Layer, config: tf.serialization.ConfigDict} 
}


export const LAYERS: Layers = {
    Dense: {
      fn: tf.layers.dense,
      config: {
        units: 1,
        activation: null,
        useBias: true,
        kernelInitializer: "glorotUniform",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Conv1D: {
      fn: tf.layers.conv1d,
      config: {
        filters: 1,
        kernelSize: 1,
        strides: 1,
        padding: 'valid',
        dataFormat: 'channelsLast',
        dilationRate: 1,
        activation: null,
        useBias: true,
        kernelInitializer: "glorotUniform",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Conv2D: {
      fn: tf.layers.conv2d,
      config: {
        filters: 1,
        kernelSize: 1,
        strides: [1, 1],
        padding: 'valid',
        dataFormat: 'channelsLast',
        dilationRate: [1, 1],
        activation: null,
        useBias: true,
        kernelInitializer: "glorotUniform",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Conv2DTranspose: {
      fn: tf.layers.conv2dTranspose,
      config: {
        filters: 1,
        kernelSize: 1,
        strides: [1, 1],
        padding: 'valid',
        dataFormat: 'channelsLast',
        dilationRate: [1, 1],
        activation: null,
        useBias: true,
        kernelInitializer: "glorotUniform",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    SeparableConv2D: {
      fn: tf.layers.separableConv2d,
      config: {
        filters: 1,
        kernelSize: 1,
        strides: [1, 1],
        padding: 'valid',
        dataFormat: 'channelsLast',
        dilationRate: [1, 1],
        depthMultiplier: 1,
        activation: null,
        useBias: true,
        depthwiseInitializer: "glorotUniform",
        pointwiseInitializer: "glorotUniform",
        biasInitializer: "zeros",
        depthwiseRegularizer: null,
        pointwiseRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        depthwiseConstraint: null,
        pointwiseConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    MaxPooling1D: {
      fn: tf.layers.maxPooling1d,
      config: {
        poolSize: 2,
        strides: null,
        padding: 'valid',
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    MaxPooling2D: {
      fn: tf.layers.maxPooling2d,
      config: {
        poolSize: [2, 2],
        strides: [2, 2],
        padding: 'valid',
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    AveragePooling1D: {
      fn: tf.layers.averagePooling1d,
      config: {
        poolSize: 2,
        strides: null,
        padding: 'valid',
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    AveragePooling2D: {
      fn: tf.layers.averagePooling2d,
      config: {
        poolSize: [2, 2],
        strides: [2, 2],
        padding: 'valid',
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    BatchNormalization: {
      fn: tf.layers.batchNormalization,
      config: {
        axis: -1,
        momentum: 0.99,
        epsilon: 0.001,
        center: true,
        scale: true,
        betaInitializer: "zeros",
        gammaInitializer: "ones",
        movingMeanInitializer: "zeros",
        movingVarianceInitializer: "ones",
        betaConstraint: null,
        gammaConstraint: null,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    LayerNormalization: {
      fn: tf.layers.layerNormalization,
      config: {
        axis: -1,
        epsilon: 0.001,
        center: true,
        scale: true,
        betaInitializer: "zeros",
        gammaInitializer: "ones",
        betaConstraint: null,
        gammaConstraint: null,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    LSTM: {
      fn: tf.layers.lstm,
      config: {
        units: 1,
        activation: "tanh",
        recurrentActivation: "sigmoid",
        useBias: true,
        kernelInitializer: "glorotUniform",
        recurrentInitializer: "orthogonal",
        biasInitializer: "zeros",
        unitForgetBias: true,
        kernelRegularizer: null,
        recurrentRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        recurrentConstraint: null,
        biasConstraint: null,
        dropout: 0.0,
        recurrentDropout: 0.0,
        returnSequences: false,
        returnState: false,
        goBackwards: false,
        stateful: false,
        timeMajor: false,
        unroll: false,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    GRU: {
      fn: tf.layers.gru,
      config: {
        units: 1,
        activation: "tanh",
        recurrentActivation: "sigmoid",
        useBias: true,
        kernelInitializer: "glorotUniform",
        recurrentInitializer: "orthogonal",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        recurrentRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        recurrentConstraint: null,
        biasConstraint: null,
        dropout: 0.0,
        recurrentDropout: 0.0,
        returnSequences: false,
        returnState: false,
        goBackwards: false,
        stateful: false,
        timeMajor: false,
        unroll: false,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    SimpleRNN: {
      fn: tf.layers.simpleRNN,
      config: {
        units: 1,
        activation: "tanh",
        useBias: true,
        kernelInitializer: "glorotUniform",
        recurrentInitializer: "orthogonal",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        recurrentRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        recurrentConstraint: null,
        biasConstraint: null,
        dropout: 0.0,
        recurrentDropout: 0.0,
        returnSequences: false,
        returnState: false,
        goBackwards: false,
        stateful: false,
        unroll: false,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Embedding: {
      fn: tf.layers.embedding,
      config: {
        inputDim: 1,
        outputDim: 1,
        embeddingsInitializer: "randomUniform",
        embeddingsRegularizer: null,
        activityRegularizer: null,
        embeddingsConstraint: null,
        maskZero: false,
        inputLength: null,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Dropout: {
      fn: tf.layers.dropout,
      config: {
        rate: 0.5,
        noiseShape: null,
        seed: null,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Flatten: {
      fn: tf.layers.flatten,
      config: {
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Reshape: {
      fn: tf.layers.reshape,
      config: {
        targetShape: [],
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    ReLU: {
      fn: tf.layers.reLU,
      config: {
        maxValue: null,
        negativeSlope: 0,
        threshold: 0,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Softmax: {
      fn: tf.layers.softmax,
      config: {
        axis: -1,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    LeakyReLU: {
      fn: tf.layers.leakyReLU,
      config: {
        alpha: 0.3,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    ELU: {
      fn: tf.layers.elu,
      config: {
        alpha: 1.0,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Conv3D: {
      fn: tf.layers.conv3d,
      config: {
        filters: 1,
        kernelSize: 1,
        strides: [1, 1, 1],
        padding: 'valid',
        dataFormat: 'channelsLast',
        dilationRate: [1, 1, 1],
        activation: null,
        useBias: true,
        kernelInitializer: "glorotUniform",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Conv3DTranspose: {
      fn: tf.layers.conv3dTranspose,
      config: {
        filters: 1,
        kernelSize: 1,
        strides: [1, 1, 1],
        padding: 'valid',
        dataFormat: 'channelsLast',
        dilationRate: [1, 1, 1],
        activation: null,
        useBias: true,
        kernelInitializer: "glorotUniform",
        biasInitializer: "zeros",
        kernelRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        kernelConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    MaxPooling3D: {
      fn: tf.layers.maxPooling3d,
      config: {
        poolSize: [2, 2, 2],
        strides: [2, 2, 2],
        padding: 'valid',
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    AveragePooling3D: {
      fn: tf.layers.averagePooling3d,
      config: {
        poolSize: [2, 2, 2],
        strides: [2, 2, 2],
        padding: 'valid',
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Add: {
      fn: tf.layers.add,
      config: {
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Concatenate: {
      fn: tf.layers.concatenate,
      config: {
        axis: -1,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Multiply: {
      fn: tf.layers.multiply,
      config: {
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Average: {
      fn: tf.layers.average,
      config: {
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Maximum: {
      fn: tf.layers.maximum,
      config: {
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Minimum: {
      fn: tf.layers.minimum,
      config: {
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Dot: {
      fn: tf.layers.dot,
      config: {
        axes: -1,
        normalize: false,
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Activation: {
      fn: tf.layers.activation,
      config: {
        activation: 'linear',
        inputShape: null,
        batchInputShape: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    InputLayer: {
      fn: tf.layers.inputLayer,
      config: {
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        sparse: false,
        name: null,
        trainable: true
      }
    },
    RNN: {
      fn: tf.layers.rnn,
      config: {
        cell: null,
        returnSequences: false,
        returnState: false,
        goBackwards: false,
        stateful: false,
        unroll: false,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    TimeDistributed: {
      fn: tf.layers.timeDistributed,
      config: {
        layer: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    UpSampling2D: {
      fn: tf.layers.upSampling2d,
      config: {
        size: [2, 2],
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    ZeroPadding2D: {
      fn: tf.layers.zeroPadding2d,
      config: {
        padding: [[1, 1], [1, 1]],
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    Cropping2D: {
      fn: tf.layers.cropping2D,
      config: {
        cropping: [[0, 0], [0, 0]],
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    GlobalAveragePooling2D: {
      fn: tf.layers.globalAveragePooling2d,
      config: {
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    GlobalMaxPooling2D: {
      fn: tf.layers.globalMaxPooling2d,
      config: {
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    GlobalAveragePooling1D: {
      fn: tf.layers.globalAveragePooling1d,
      config: {
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    GlobalMaxPooling1D: {
      fn: tf.layers.globalMaxPooling1d,
      config: {
        dataFormat: 'channelsLast',
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    },
    DepthwiseConv2D: {
      fn: tf.layers.depthwiseConv2d,
      config: {
        kernelSize: 3,
        strides: [1, 1],
        padding: 'valid',
        dataFormat: 'channelsLast',
        dilationRate: [1, 1],
        depthMultiplier: 1,
        activation: null,
        useBias: true,
        depthwiseInitializer: "glorotUniform",
        biasInitializer: "zeros",
        depthwiseRegularizer: null,
        biasRegularizer: null,
        activityRegularizer: null,
        depthwiseConstraint: null,
        biasConstraint: null,
        inputShape: null,
        batchInputShape: null,
        batchSize: null,
        dtype: 'float32',
        name: null,
        trainable: true
      }
    }
  }
  
  
const old = {
 // Dense Layers
 'Dense': tf.layers.dense,

 // Convolutional Layers
 'Conv1D': tf.layers.conv1d,
 'Conv2D': tf.layers.conv2d,
 'Conv2DTranspose': tf.layers.conv2dTranspose,
 'SeparableConv2D': tf.layers.separableConv2d,

 // Pooling Layers
 'MaxPooling1D': tf.layers.maxPooling1d,
 'MaxPooling2D': tf.layers.maxPooling2d,
 'AveragePooling1D': tf.layers.averagePooling1d,
 'AveragePooling2D': tf.layers.averagePooling2d,

 // Normalization Layers
 'BatchNormalization': tf.layers.batchNormalization,
 'LayerNormalization': tf.layers.layerNormalization,

 // Recurrent Layers
 'LSTM': tf.layers.lstm,
 'GRU': tf.layers.gru,
 'SimpleRNN': tf.layers.simpleRNN,

 // Embedding Layer
 'Embedding': tf.layers.embedding,

 // Dropout Layer
 'Dropout': tf.layers.dropout,

 // Flatten Layer
 'Flatten': tf.layers.flatten,

 // Reshape Layer
 'Reshape': tf.layers.reshape,

 // Activation Layer
 'ReLU': tf.layers.reLU,
 'Softmax': tf.layers.softmax,

 // Advanced Activation Layers
 'LeakyReLU': tf.layers.leakyReLU,
 'ELU': tf.layers.elu,

 // Convolutional Layers for 3D data
 'Conv3D': tf.layers.conv3d,
 'Conv3DTranspose': tf.layers.conv3dTranspose,
 'MaxPooling3D': tf.layers.maxPooling3d,
 'AveragePooling3D': tf.layers.averagePooling3d,

 // Additional Layers
 'Add': tf.layers.add,
 'Concatenate': tf.layers.concatenate,
 'Multiply': tf.layers.multiply,
 'Average': tf.layers.average,
 'Maximum': tf.layers.maximum,
 'Minimum': tf.layers.minimum,
 'Dot': tf.layers.dot,
 'Activation': tf.layers.activation,
 'InputLayer': tf.layers.inputLayer,
 'RNN': tf.layers.rnn,
 'TimeDistributed': tf.layers.timeDistributed,
 'UpSampling2D': tf.layers.upSampling2d,
 'ZeroPadding2D': tf.layers.zeroPadding2d,
 'Cropping2D': tf.layers.cropping2D,
 'GlobalAveragePooling2D': tf.layers.globalAveragePooling2d,
 'GlobalMaxPooling2D': tf.layers.globalMaxPooling2d,
 'GlobalAveragePooling1D': tf.layers.globalAveragePooling1d,
 'GlobalMaxPooling1D': tf.layers.globalMaxPooling1d,
 'DepthwiseConv2D': tf.layers.depthwiseConv2d
}

export const GROUPED_LAYERS = {
    Basic: ['Dense', 'Dropout', 'Flatten', 'Reshape', 'Embedding'],
    Convolutional: [
      'Conv1D', 'Conv2D', 'Conv2DTranspose', 'SeparableConv2D',
      'Conv3D', 'Conv3DTranspose'
    ],
    Pooling: [
      'MaxPooling1D', 'MaxPooling2D', 'MaxPooling3D',
      'AveragePooling1D', 'AveragePooling2D', 'AveragePooling3D'
    ],
    Normalization: ['BatchNormalization', 'LayerNormalization'],
    Recurrent: [
      'LSTM', 'GRU', 'SimpleRNN', 'RNN', 'TimeDistributed'
    ],
    Activation: [
      'ReLU', 'Softmax', 'LeakyReLU', 'ELU', 'Activation'
    ],
    AdvancedActivation: ['LeakyReLU', 'ELU'],
    Conv3D: ['Conv3D', 'Conv3DTranspose', 'MaxPooling3D', 'AveragePooling3D', 'DepthwiseConv2D'],
    Additional: [
      'Add', 'Concatenate', 'Multiply', 'Average', 'Maximum', 'Minimum', 'Dot',
      'InputLayer', 'UpSampling2D', 'ZeroPadding2D', 'Cropping2D',
      'GlobalAveragePooling2D', 'GlobalMaxPooling2D', 'GlobalAveragePooling1D', 'GlobalMaxPooling1D'
    ]
  };