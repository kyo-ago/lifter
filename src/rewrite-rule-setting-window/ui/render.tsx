import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {configureStore} from './store';
import App from './components/index';
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";

export function render(container: Element | null) {
    ipcRendererHandler.on("responseAllRewriteRules", (allRewriteRules: any) => {
        const store = configureStore();

        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            container,
        );
    });
    ipcRendererHandler.send("getAllRewriteRules");
}
