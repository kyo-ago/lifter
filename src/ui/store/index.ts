import {createStore} from 'redux';
import {reducer} from '../reducers/index';

export function configureStore() {
    const store = createStore(reducer);
    return store;
}