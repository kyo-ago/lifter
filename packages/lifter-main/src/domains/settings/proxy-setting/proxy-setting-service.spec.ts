import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../test/mocks/create-services";
import { MockStateEvent } from "../../../../test/mocks/mock-state-event";
import { NetworksetupProxyService } from "../networksetup-proxy/networksetup-proxy-service";
import { UserSettingsService } from "../user-settings/user-settings-service";
import { ProxySettingService } from "./proxy-setting-service";

describe("ProxySettingService", () => {
    let proxySettingService: ProxySettingService;
    let networksetupProxyService: NetworksetupProxyService;
    let userSettingsService: UserSettingsService;
    beforeEach(async () => {
        let application = await createApplication();
        proxySettingService = application.getServiceContext().proxySettingService;
        networksetupProxyService = application.getServiceContext().networksetupProxyService;
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
        await networksetupProxyService.load();
        let result = await getNetworksetupProxyService().change();
        assert(result === "On");

        let fetchResult = await getNetworksetupProxyService().fetch();
        assert(fetchResult === "On");
    });
});
