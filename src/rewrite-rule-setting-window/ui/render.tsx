import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {configureStore} from "./store";
import App from "./components/index";
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";
import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ShareRewriteRuleFactory} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-factory";
import {None} from "monapt";

export function render(container: Element | null) {
    ipcRendererHandler.on("responseAllRewriteRules", (allRewriteRules: ShareRewriteRuleEntityJSON[]) => {
        let allRewriteRuleEntities = allRewriteRules.map((json) => ShareRewriteRuleFactory.fromJSON(json));

        const store = configureStore({
            rewriteRules: allRewriteRuleEntities,
            currentRewriteRule: None,
        });

        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            container,
        );
    });
    ipcRendererHandler.send("getAllRewriteRules");
}
