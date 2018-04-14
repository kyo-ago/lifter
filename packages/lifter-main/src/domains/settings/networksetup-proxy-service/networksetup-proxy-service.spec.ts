import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../test/mocks/create-services";
import { MockStateEvent } from "../../../../test/mocks/mock-state-event";
import { NetworksetupProxyService } from "./networksetup-proxy-service";

describe("NetworksetupProxyService", () => {
    let networksetupProxyService: NetworksetupProxyService;
    beforeEach(async () => {
        let application = await createApplication();
        networksetupProxyService = application.getServiceContext().networksetupProxyService;
    });

    let getNetworksetupProxyService = () => {
        return networksetupProxyService.getNetworksetupProxyService();
    };

    it("fetchProxyCommandGrantStatus", async () => {
        let result = await getNetworksetupProxyService().fetchProxyCommandGrantStatus();
        assert(result === "Off");
    });

    [["initialize", "On"], ["CancelGrant", "Off"], ["Off", "On"], ["On", "Off"]].forEach(([from, to]) => {
        it(`changeProxyCommandGrantStatus ${from} to ${to}`, async () => {
            MockStateEvent.emit("updateProxyCommandGrantStatus", <any>from);
            // reload MockStateEvent state
            await networksetupProxyService.load();

            let result = await getNetworksetupProxyService().changeProxyCommandGrantStatus();
            assert(result === to);
        });
    });

    it("changeProxyCommandGrantStatus to fetch", async () => {
        let result = await getNetworksetupProxyService().changeProxyCommandGrantStatus();
        assert(result === "On");

        let fetchResult = await getNetworksetupProxyService().fetchProxyCommandGrantStatus();
        assert(fetchResult === "On");
    });
});
