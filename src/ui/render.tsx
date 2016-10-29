import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {configureStore} from './store/index';
import App from './components/index';

const store = configureStore();

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.body
    );
});
