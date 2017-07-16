import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {configureStore} from './store';
import App from './components/index';

export function render(container: Element | null) {
    const store = configureStore();

    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        container,
    );
}
