import {ShareIpcRendererHandler} from "../../share/libs/share-ipc-renderer-handler";

interface Handlers {
}

interface Senders {
}

interface SyncSenders {
}

export const ipcRendererHandler = new ShareIpcRendererHandler<Handlers, Senders, SyncSenders>();
