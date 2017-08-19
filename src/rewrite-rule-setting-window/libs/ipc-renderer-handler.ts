import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ShareIpcRendererHandler} from "../../share/libs/share-ipc-renderer-handler";

interface Handlers {
    "responseAllRewriteRules": ShareRewriteRuleEntityJSON[];
}

interface Senders {
    "getAllRewriteRules": void;
    "overwriteAllRewriteRules": ShareRewriteRuleEntityJSON[];
}

interface SyncSenders {
}

export const ipcRendererHandler = new ShareIpcRendererHandler<Handlers, Senders, SyncSenders>();
