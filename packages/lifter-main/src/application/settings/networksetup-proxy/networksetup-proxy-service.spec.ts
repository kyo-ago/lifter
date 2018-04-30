import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../test/mocks/create-services";
import { MockStateEvent } from "../../../../test/mocks/mock-state-event";
import { ProxyCommandGrantService } from "../proxy-command-grant/proxy-command-grant-service";

describe("ProxyCommandGrantService", () => {
    let proxyCommandGrantService: ProxyCommandGrantService;
    beforeEach(async () => {
        let application = await createApplication();
        proxyCommandGrantService = application.getServiceContext().proxyCommandGrantService;
    });

    let getProxyCommandGrantService = () => {
        return proxyCommandGrantService.getProxyCommandGrantService();
    };

    it("fetchStatus", async () => {
        let result = await getProxyCommandGrantService().fetchStatus();
        assert(result === "Off");
    });

    [["initialize", "On"], ["CancelGrant", "Off"], ["Off", "On"], ["On", "Off"]].forEach(([from, to]) => {
        it(`changeProxyCommandGrantStatus ${from} to ${to}`, async () => {
            MockStateEvent.emit("updateProxyCommandGrantStatus", <any>from);
            // reload MockStateEvent state
            await proxyCommandGrantService.load();

            let result = await getProxyCommandGrantService().changeStatus();
            assert(result === to);
        });
    });

    it("changeStatus to fetch", async () => {
        let result = await getProxyCommandGrantService().changeStatus();
        assert(result === "On");

        let fetchResult = await getProxyCommandGrantService().fetchStatus();
        assert(fetchResult === "On");
    });
});
