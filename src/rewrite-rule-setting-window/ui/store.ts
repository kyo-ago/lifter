import {createStore} from 'redux';
import {reducer} from './reducer';

export function configureStore() {
    const store = createStore(reducer);
    return store;
}
