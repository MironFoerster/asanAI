export class CoroutineRunner {
    private generatorStacks: Generator<any, any, unknown>[][] = [];
    private addQueue: Generator<any, any, unknown>[][] = [];
    private removeQueue: Set<Generator<any, any, unknown>> = new Set();

    constructor() {
        // Initialize generatorStacks with an empty array to avoid issues
        this.generatorStacks = [[]];
    }

    isBusy(): boolean {
        return this.addQueue.length + this.generatorStacks.length > 0;
    }

    add(generator: Generator<any, any, unknown>): void {
        const genStack: Generator<any, any, unknown>[] = [generator];
        this.addQueue.push(genStack);
    }

    remove(generator: Generator<any, any, unknown>): void {
        this.removeQueue.add(generator);
    }

    update(): void {
        this._addQueued();
        this._removeQueued();
        for (const genStack of this.generatorStacks) {
            const main = genStack[0];
            // Handle if one coroutine removes another
            if (this.removeQueue.has(main)) {
                continue;
            }

            while (genStack.length) {
                const topGen = genStack[genStack.length - 1];
                const { value, done } = topGen.next();
                if (done) {
                    if (genStack.length === 1) {
                        this.removeQueue.add(topGen);
                        break;
                    }
                    genStack.pop();
                } else if (value) {
                    genStack.push(value);
                } else {
                    break;
                }
            }
        }

        this._removeQueued();
    }

    private _addQueued(): void {
        if (this.addQueue.length) {
            this.generatorStacks.splice(this.generatorStacks.length, 0,...this.addQueue);
            this.addQueue = [];
        }
    }

    private _removeQueued(): void {
        if (this.removeQueue.size) {
            this.generatorStacks = this.generatorStacks.filter((genStack) =>!this.removeQueue.has(genStack[0]));
            this.removeQueue.clear();
        }
    }
}