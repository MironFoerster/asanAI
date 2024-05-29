export interface State {
    startState?: {[key: string]: number}
    elapsedTime?: number
    enter?: Function
    update: Function
    exit?: Function
}

export interface States {
    [key: string]: State
}

export class StateMachine {
    states: States
    currentState: string = ""

    constructor( states: States, initialState: string ) {

        this.states = states;
        this.transition( initialState );

    }
    get state() {

        return this.currentState;

    }
    transition( state: string, ...args: any[]) {

        const oldState = this.states[ this.currentState ];
        if ( oldState && oldState.exit ) {

            oldState.exit.call( this );

        }

        this.currentState = state;
        const newState = this.states[ state ];
        if ( newState.enter ) {

            newState.enter.call( this, ...args);

        }

    }
    update() {

        const state = this.states[ this.currentState ];
        if ( state.update ) {

            state.update.call( this );

        }

    }

}