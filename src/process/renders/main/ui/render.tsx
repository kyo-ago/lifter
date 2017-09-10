import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {Index} from "./components/index";
import {configureStore} from './store';

export async function render(container: Element | null) {
    const store = configureStore();
    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        container,
    );
}
