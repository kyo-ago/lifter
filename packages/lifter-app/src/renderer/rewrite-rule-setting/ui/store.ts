import { createStore } from "redux";
import { reducer, StateToProps } from "./reducer";

export function configureStore(preloadedState?: StateToProps) {
    const store = createStore(reducer, preloadedState);
    return store;
}
