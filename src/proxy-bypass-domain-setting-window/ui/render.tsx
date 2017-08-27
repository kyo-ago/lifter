import {remote} from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {ShareProxyBypassDomainEntityJSON} from "../../share/domain/share-proxy-bypass-domain/share-proxy-bypass-domain-entity";
import {App, Index, JSONToEntity} from "./components/index";
import {configureStore} from "./store";

const windowManager = remote.require('@kyo-ago/electron-window-manager');

export function render(container: Element | null) {
    let jsons: ShareProxyBypassDomainEntityJSON[] = windowManager.sharedData.fetch('mainProxyBypassDomains');
    windowManager.sharedData.set('mainProxyBypassDomains', []);

    let Entities = jsons.map((json) => JSONToEntity(json));

    const store = configureStore({
        proxyBypassDomains: Entities,
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
