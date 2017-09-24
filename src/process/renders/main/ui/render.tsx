import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {windowManager} from "../../libs/get-window-manager";
import {Index} from './components/index';
import {configureStore} from './store';

export async function render(container: Element | null) {
    let jsons = windowManager.sharedData.fetch('mainApps');
    windowManager.sharedData.set('mainApps', {} as any);
    console.log(jsons);

    const store = configureStore(jsons);

    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        container,
    );
}
