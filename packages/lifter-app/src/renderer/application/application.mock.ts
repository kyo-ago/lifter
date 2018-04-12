import * as sinon from "sinon";
import { ApplicationMainStateJSON } from "../../main/window-manager";
import { Application } from "./application";
import { ContextMenuService } from "./context-menu/context-menu-service";

let sandbox = sinon.createSandbox();

let applicationMock = sandbox.createStubInstance<Application>(Application);

beforeEach(() => {
    applicationMock.getCurrentState.callsFake((): ApplicationMainStateJSON => ({
        autoResponderEntries: [],
        clientRequestEntries: [],
        proxyBypassDomainEntries: [],
        rewriteRuleEntries: [],
        certificateState: "Missing",
        proxySettingStatus: "Off",
        proxyCommandGrantStatus: "Off",
        noAutoEnableProxySetting: false,
        noPacFileProxySetting: false,
    }));
    let contextMenuService = sandbox.createStubInstance<ContextMenuService>(ContextMenuService);
    applicationMock.contextMenuService = <any>contextMenuService;
    applicationMock.addDropFiles.resolves([]);
    applicationMock.selectDialogEntry.resolves([]);
    applicationMock.fetchAutoResponderEntities.resolves([]);
    applicationMock.deleteAutoResponderEntities.resolves();
    applicationMock.changeCertificateStatus.resolves("Installed");
    applicationMock.changeProxySettingStatus.resolves("On");
    applicationMock.changeProxyCommandGrantStatus.resolves("On");
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
});

afterEach(() => {
    sandbox.reset();
});

export const ApplicationMock = applicationMock;
