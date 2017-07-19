import {CertificateStatus} from "../application/certificate/certificate-service";
import {ProxySettingStatus} from "../application/proxy-setting/proxy-setting-service";
import {ShareIpcRendererHandler} from "../../share/libs/share-ipc-renderer-handler";

interface Handlers {
    "clickCertificateStatus": void;
    "clickProxySettingStatus": void;
    "addAutoResponderEntry": void;
    "getAllRewriteRules": void;
}

interface Senders {
    "clickCertificateStatus": CertificateStatus;
    "clickProxySettingStatus": ProxySettingStatus;
    "openRewriteRuleSettingWindow": void;
    "responseAllRewriteRules": any;
}

interface SyncSenders {
    "getUserDataPath": string;
}

export const ipcRendererHandler = new ShareIpcRendererHandler<Handlers, Senders, SyncSenders>();
