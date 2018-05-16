import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { MockStateEvent } from "../../../../test/mocks/mock-state-event";
import { ProxyCommandGrantService } from "../../../domains/settings/proxy-command-grant/proxy-command-grant-service";
import { UserSettingsService } from "../../../domains/settings/user-settings/user-settings-service";
import { ProxySettingService } from "./proxy-setting-service";

describe("ProxySettingService", () => {
    let proxySettingService: ProxySettingService;
    let proxyCommandGrantService: ProxyCommandGrantService;
    let userSettingsService: UserSettingsService;
    beforeEach(async () => {
        let container = await getTestContainer();
        proxySettingService = container.get(ProxySettingService);
        proxyCommandGrantService = container.get(ProxyCommandGrantService);
        userSettingsService = container.get(UserSettingsService);
    });

    let getNetworksetupProxyService = () => {
        return proxySettingService.getProxySettingService();
    };

    it("fetchProxyCommandGrantStatus", async () => {
        let result = await getNetworksetupProxyService().fetch();
        assert(result === "Off");
    });

    [["initialize", "On"], ["Off", "On"], ["On", "Off"]].forEach(
        ([from, to]) => {
            it(`change ${from} to ${to}`, async () => {
                MockStateEvent.emit("updateProxySettingState", <any>from);
                let result = await getNetworksetupProxyService().change();
                assert(result === to);
            });
        },
    );

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
