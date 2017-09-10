import {createStore} from "redux";
import {reducer, StateToProps} from "./reducer";

export function configureStore() {
    const store = createStore(reducer);
    return store;
}