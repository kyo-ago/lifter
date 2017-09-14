import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {windowManager} from '../../libs/get-window-manager';
import {App, Index, JSONToEntity} from './components/index';
import {configureStore} from './store';

export function render(container: Element | null) {
    let jsons = windowManager.sharedData.fetch('mainProxyBypassDomains');
    windowManager.sharedData.set('mainProxyBypassDomains', []);

    let entities = jsons.map((json) => JSONToEntity(json));

    const store = configureStore({
        proxyBypassDomains: entities,
    });

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
