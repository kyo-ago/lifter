import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ShareIpcRendererHandler} from "../../share/libs/share-ipc-renderer-handler";
import {CertificateStatus} from "../application/certificate/certificate-service";
import {ProxySettingStatus} from "../application/proxy-setting/proxy-setting-service";

interface Handlers {
    "clickCertificateStatus": void;
    "clickProxySettingStatus": void;
    "addAutoResponderEntry": void;
    "getAllRewriteRules": void;
    "overwriteAllRewriteRules": ShareRewriteRuleEntityJSON[];
}

interface Senders {
    "clickCertificateStatus": CertificateStatus;
    "clickProxySettingStatus": ProxySettingStatus;
    "openRewriteRuleSettingWindow": void;
    "responseAllRewriteRules": ShareRewriteRuleEntityJSON[];
}

interface SyncSenders {
    "getUserDataPath": void;
}

export const ipcRendererHandler = new ShareIpcRendererHandler<Handlers, Senders, SyncSenders>();
