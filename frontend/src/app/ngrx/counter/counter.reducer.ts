import { initialState } from "./counter.store";



export const  counterReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'increment':
            return {
                ...state,
                count: state.count + 1
            };
        case 'decrement':
            return {
                ...state,
                count: state.count - 1
            };
        case 'reset':
            return {
                ...state,
                count: 0
            };
        default:
            return state;
    }
}