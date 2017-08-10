import {ShareIpcRendererHandler} from "../../share/libs/share-ipc-renderer-handler";
import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";

interface Handlers {
    "responseAllRewriteRules": ShareRewriteRuleEntityJSON[];
}

interface Senders {
    "getAllRewriteRules": void;
}

export const ipcRendererHandler = new ShareIpcRendererHandler<Handlers, Senders, {}>();
