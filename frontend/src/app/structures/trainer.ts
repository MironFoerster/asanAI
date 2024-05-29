export class Trainer {
    epochs: number = 10;
    split: number = 10;
    batchSize: number = 10;
    optimizer: string = "adam";
    loss: string = "meanSquaredError";
    optParams: {
        [key: string]: number | boolean | undefined;
        alpha: number,
        momentum?: number,
        useNesterov?: boolean,
        initialAccumulatorValue?: number,
        rho?: number,
        epsilon?: number,
        beta1?: number,
        beta2?: number,
        decay?: number,
        centered?: boolean,
    } = {
        alpha: 0.1
    }
}