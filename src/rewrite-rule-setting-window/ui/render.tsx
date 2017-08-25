import {None} from "monapt";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";
import {App, Index, RewriteRuleFactoryFromJSON} from "./components/index";
import {configureStore} from "./store";

export function render(container: Element | null) {
    ipcRendererHandler.on("responseAllRewriteRules", (ipcRendererEvent, allRewriteRules: ShareRewriteRuleEntityJSON[]) => {
        let allRewriteRuleEntities = allRewriteRules.map((json) => RewriteRuleFactoryFromJSON(json));

        const store = configureStore({
            rewriteRules: allRewriteRuleEntities,
            currentRewriteRule: None,
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
    });

    ipcRendererHandler.send("getAllRewriteRules");
}
