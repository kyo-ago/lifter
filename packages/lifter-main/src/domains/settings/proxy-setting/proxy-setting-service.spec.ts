import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../test/mocks/create-services";
import { MockStateEvent } from "../../../../test/mocks/mock-state-event";
import { ProxyCommandGrantService } from "../proxy-command-grant/proxy-command-grant-service";
import { UserSettingsService } from "../user-settings/user-settings-service";
import { ProxySettingService } from "./proxy-setting-service";

describe("ProxySettingService", () => {
    let proxySettingService: ProxySettingService;
    let proxyCommandGrantService: ProxyCommandGrantService;
    let userSettingsService: UserSettingsService;
    beforeEach(async () => {
        let application = await createApplication();
        proxySettingService = application.getServiceContext().proxySettingService;
        proxyCommandGrantService = application.getServiceContext().proxyCommandGrantService;
        userSettingsService = application.getServiceContext().userSettingsService;
    });

    let getNetworksetupProxyService = () => {
        return proxySettingService.getProxySettingService();
    };

    it("fetchProxyCommandGrantStatus", async () => {
        let result = await getNetworksetupProxyService().fetch();
        assert(result === "Off");
    });

    [["initialize", "On"], ["Off", "On"], ["On", "Off"]].forEach(([from, to]) => {
        it(`change ${from} to ${to}`, async () => {
            MockStateEvent.emit("updateProxySettingState", <any>from);
            let result = await getNetworksetupProxyService().change();
            assert(result === to);
        });
    });

    it("change to fetch", async () => {
        MockStateEvent.emit("updateProxyCommandGrantStatus", "On");
        MockStateEvent.emit("updateProxySettingState", "Off");
        // reload updateProxyCommandGrantStatus
        await proxyCommandGrantService.load();
        let result = await getNetworksetupProxyService().change();
        assert(result === "On");

        let fetchResult = await getNetworksetupProxyService().fetch();
        assert(fetchResult === "On");
    });
});
