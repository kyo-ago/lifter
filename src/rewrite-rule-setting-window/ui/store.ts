import {createStore} from 'redux';
import {reducer} from './reducer';

export function configureStore(preloadedState?: any) {
    const store = createStore(reducer, preloadedState);
    return store;
}
