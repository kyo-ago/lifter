import * as mockRequire from "mock-require";
import * as sinon from "sinon";
import * as ExecCommands from "../../../../src/libs/exec-commands";
import { MockStateEvent } from "../../mock-state-event";
import {
    MockCertificateStatus,
    setCetificateState,
} from "./set-cetificate-state";
import {
    MockProxySettingStatus,
    setProxySettingState,
} from "./set-proxy-setting-state";

export type ExecCommandsStub = sinon.SinonStubbedInstance<typeof ExecCommands>;

let sandbox = sinon.createSandbox();
let stub = sandbox.stub(ExecCommands);

MockStateEvent.on(
    "updateCertificateState",
    (newState: MockCertificateStatus) => {
        let setStub = setCetificateState(newState);
        setStub(stub);
    },
);

MockStateEvent.on(
    "updateProxySettingState",
    (newState: MockProxySettingStatus) => {
        let setStub = setProxySettingState(newState);
        setStub(stub);
    },
);

stub.getIfconfig.resolves(`
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
        inet 127.0.0.1 netmask 0xff000000 
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
        inet 192.168.150.51 netmask 0xffffff00 broadcast 192.168.150.255
        status: active
`);

mockRequire("../../../../src/libs/exec-commands", stub);

afterEach(() => {
    sandbox.resetHistory();
});
