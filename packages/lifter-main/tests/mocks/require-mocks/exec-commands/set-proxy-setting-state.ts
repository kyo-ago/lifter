import { ProxySettingStatus } from "@lifter/lifter-common";
import { NETWORK_HOST_NAME, PROXY_PORT } from "../../../../src/settings";
import { ExecCommandsStub } from "./exec-commands";

export const MockNetworksetupResult = `\nAn asterisk (*) denotes that a network service is disabled.
(1) iPhone USB
(Hardware Port: iPhone USB, Device: en2)

(2) Wi Fi
(Hardware Port: Wi-Fi, Device: en0)

(3) Bluetooth PAN
(Hardware Port: Bluetooth PAN, Device: en1)\n\n`;

export const getMockWebproxyState = (param = {}) => {
    let command = {
        Enabled: "Yes",
        Server: NETWORK_HOST_NAME,
        Port: PROXY_PORT,
        ...param,
    };
    return `\nEnabled: ${command.Enabled}
Server: ${command.Server}
Port: ${command.Port}
Authenticated Proxy Enabled: 0\n`
};

export type MockProxySettingStatus = ProxySettingStatus | "initialize";

export function setProxySettingState (newState: MockProxySettingStatus) {
    if (newState === "On") {
        return setWebProxyingState;
    }
    if (newState === "Off") {
        return setNoWebProxyState;
    }
    if (newState === "initialize") {
        return setInitializedState;
    }
    console.error(`Invalid proxy setting state "${newState}".`);
};

let setNoWebProxyState = (stub: ExecCommandsStub) => {
    let command = { Enabled: 'No' };
    stub.getWebproxy.resolves(getMockWebproxyState(command));
    stub.getSecureWebproxy.resolves(getMockWebproxyState(command));
};

let setWebProxyingState = (stub: ExecCommandsStub) => {
    stub.getWebproxy.resolves(getMockWebproxyState());
    stub.getSecureWebproxy.resolves(getMockWebproxyState());
};

let setInitializedState = (stub: ExecCommandsStub) => {
    stub.getListnetworkserviceorder.resolves(MockNetworksetupResult);
    stub.getProxyByPassDomains.resolves(`\n*.local\n169.254/16\n`);
    setNoWebProxyState(stub);
};
