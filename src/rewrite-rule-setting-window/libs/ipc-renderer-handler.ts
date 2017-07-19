import {ShareIpcRendererHandler} from "../../share/libs/share-ipc-renderer-handler";

interface Handlers {
    "responseAllRewriteRules": any;
}

interface Senders {
    "getAllRewriteRules": void;
}

export const ipcRendererHandler = new ShareIpcRendererHandler<Handlers, Senders, {}>();
