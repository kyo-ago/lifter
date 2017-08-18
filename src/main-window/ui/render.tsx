import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {configureStore} from './store';
import {Index, load} from "./components/index";

export async function render(container: Element | null) {
    await load();

    const store = configureStore();
    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        container,
    );
}
