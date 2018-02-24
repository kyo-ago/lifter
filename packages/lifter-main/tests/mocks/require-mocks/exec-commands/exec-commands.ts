import * as mockRequire from "mock-require";
import * as sinon from "sinon";
import * as ExecCommands from "../../../../src/libs/exec-commands";
import { MockStateEvent } from "../../mock-state-event";
import { MockCertificateStatus, setCetificateState } from "./set-cetificate-state";
import { MockProxySettingStatus, setProxySettingState } from "./set-proxy-setting-state";

export type ExecCommandsStub = sinon.SinonStubbedInstance<typeof ExecCommands>;

let sandbox = sinon.createSandbox();
let stub = sandbox.stub(ExecCommands);

MockStateEvent.on("updateCertificateState", (newState: MockCertificateStatus) => {
    let setStub = setCetificateState(newState);
    setStub(stub);
});

MockStateEvent.on("updateProxySettingState", (newState: MockProxySettingStatus) => {
    let setStub = setProxySettingState(newState);
    setStub(stub);
});

mockRequire("../../../../src/libs/exec-commands", stub);

afterEach(async () => {
    sandbox.reset();
});
