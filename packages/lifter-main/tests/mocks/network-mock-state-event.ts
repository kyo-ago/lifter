import { CertificateStatus, ProxySettingStatus } from "@lifter/lifter-common";
import * as EventEmitter from "events";

interface Events {
    "updateCertificateState": CertificateStatus;
    "updateProxyingState": ProxySettingStatus | "CancelGrant";
}

export const NetworkMockStateEvent = new class extends EventEmitter {
    on<K extends keyof Events>(event: K, listener: (newState: Events[K]) => void) {
        return super.on(event, listener);
    }
    emit<K extends keyof Events>(event: K, arg: Events[K]) {
        return super.emit(event, arg);
    }
};