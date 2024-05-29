import * as tf from '@tensorflow/tfjs';

interface Param {
    name: string,
    default: number|boolean,
    options: number[]|boolean[]
}
interface Optimizers {
    [key: string]: {fn: Function, params: Param[]};
   }

   export const OPTIMIZERS: Optimizers = {
    sgd: {
      fn: tf.train.sgd,
      params: [
        {name: "learningRate", default: 0.01, options: [0.001, 0.01, 0.1, 1]},
        {name: "momentum", default: 0.0, options: [0.0, 0.1, 0.9, 0.99]},
        {name: "nesterov", default: false, options: [true, false]}
      ]
    },
    adam: {
      fn: tf.train.adam,
      params: [
        {name: "learningRate", default: 0.001, options: [0.0001, 0.001, 0.01, 0.1]},
        {name: "beta1", default: 0.9, options: [0.8, 0.9, 0.99, 0.999]},
        {name: "beta2", default: 0.999, options: [0.8, 0.9, 0.99, 0.999]},
        {name: "epsilon", default: 1e-7, options: [1e-8, 1e-7, 1e-6, 1e-5]}
      ]
    },
    adagrad: {
      fn: tf.train.adagrad,
      params: [
        {name: "learningRate", default: 0.01, options: [0.001, 0.01, 0.1, 1]},
        {name: "initialAccumulatorValue", default: 0.1, options: [0.01, 0.1, 1, 10]}
      ]
    },
    rmsprop: {
      fn: tf.train.rmsprop,
      params: [
        {name: "learningRate", default: 0.001, options: [0.0001, 0.001, 0.01, 0.1]},
        {name: "rho", default: 0.9, options: [0.8, 0.9, 0.99, 0.999]},
        {name: "epsilon", default: 1e-7, options: [1e-8, 1e-7, 1e-6, 1e-5]}
      ]
    },
    adadelta: {
      fn: tf.train.adadelta,
      params: [
        {name: "learningRate", default: 1.0, options: [0.1, 1.0, 10.0, 100.0]},
        {name: "rho", default: 0.95, options: [0.8, 0.9, 0.95, 0.99]},
        {name: "epsilon", default: 1e-7, options: [1e-8, 1e-7, 1e-6, 1e-5]}
      ]
    },
    adamax: {
      fn: tf.train.adamax,
      params: [
        {name: "learningRate", default: 0.002, options: [0.001, 0.002, 0.01, 0.1]},
        {name: "beta1", default: 0.9, options: [0.8, 0.9, 0.99, 0.999]},
        {name: "beta2", default: 0.999, options: [0.8, 0.9, 0.99, 0.999]},
        {name: "epsilon", default: 1e-7, options: [1e-8, 1e-7, 1e-6, 1e-5]}
      ]
    }
   };
   