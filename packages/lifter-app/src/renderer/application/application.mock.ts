import * as sinon from "sinon";
import { ApplicationMainStateJSON } from "../../main/window-manager";
import { Application } from "./application";

let sandbox = sinon.createSandbox();

let applicationMock = sandbox.createStubInstance(Application);
applicationMock.getCurrentState.callsFake((): ApplicationMainStateJSON => ({
    autoResponderEntries: [],
    clientRequestEntries: [],
    proxyBypassDomainEntries: [],
    rewriteRuleEntries: [],
    certificateState:  "missing",
    proxySettingStatus: "Off",
    proxyCommandGrantStatus: "Off",
    noAutoEnableProxySetting: false,
    noPacFileProxySetting: false,
}));
applicationMock.addDropFiles.resolves([]);
applicationMock.selectDialogEntry.resolves([]);
applicationMock.fetchAutoResponderEntities.resolves([]);
applicationMock.deleteAutoResponderEntities.resolves();
applicationMock.changeCertificateStatus.resolves("installed");
applicationMock.changeProxySettingStatus.resolves("Off");
applicationMock.changeProxyCommandGrantStatus.resolves("Off");
applicationMock.changeNoAutoEnableProxySetting.resolves(true);
applicationMock.changeNoPacFileProxySetting.resolves(true);
applicationMock.getProxyBypassDomains.resolves([]);
applicationMock.saveProxyBypassDomains.resolves(undefined);
applicationMock.getRewriteRules.resolves([]);
applicationMock.addRewriteRule.callsFake((url: string) => {
    return {
        id: 1,
        url: url,
        modifier: [],
    };
});
applicationMock.deleteRewriteRules.resolves(undefined);
applicationMock.addRewriteRuleModifier.resolves(undefined);
applicationMock.deleteRewriteRuleModifiers.resolves(undefined);

afterEach(() => {
    sandbox.resetHistory();
});

export const ApplicationMock = applicationMock;
