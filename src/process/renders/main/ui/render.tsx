import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {configureStore} from './store';
import {Index, App} from "./components/index";

export async function render(container: Element | null) {
    let stateToProps = await App.getRender();

    const store = configureStore(stateToProps);
    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        container,
        () => {
            App.isContentRendering = true;
        },
    );
}
