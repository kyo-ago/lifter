import * as EventEmitter from "events";
import { MockProxyCommandGrantStatus } from "./require-mocks/@lifter/networksetup-proxy";
import { MockCertificateStatus } from "./require-mocks/exec-commands/set-cetificate-state";
import { MockProxySettingStatus } from "./require-mocks/exec-commands/set-proxy-setting-state";

interface Events {
    "updateCertificateState": MockCertificateStatus;
    "updateProxySettingState": MockProxySettingStatus;
    "updateProxyCommandGrantStatus": MockProxyCommandGrantStatus;
}

export const MockStateEvent = new class extends EventEmitter {
    on<K extends keyof Events>(event: K, listener: (newState: Events[K]) => void) {
        return super.on(event, listener);
    }
    emit<K extends keyof Events>(event: K, arg: Events[K]) {
        return super.emit(event, arg);
    }
};

beforeEach(() => {
    MockStateEvent.emit("updateCertificateState", "initialize");
    MockStateEvent.emit("updateProxySettingState", "initialize");
    MockStateEvent.emit("updateProxyCommandGrantStatus", "initialize");
});