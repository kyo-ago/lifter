import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../tests/mocks/create-services";
import { ProxyBypassDomainService } from "./proxy-bypass-domain-service";

describe("ProxyBypassDomainService", () => {
    let proxyBypassDomainService: ProxyBypassDomainService;
    beforeEach(async () => {
        let application = await createApplication();
        proxyBypassDomainService = application.getServiceContext().proxyBypassDomainService;
    });

    let getProxyBypassDomains = () => {
        return proxyBypassDomainService.getProxyBypassDomains();
    };

    it("fetchAll", async () => {
        let results = await getProxyBypassDomains().fetchAll();
        assert(results);
        assert(results.length === 0);
    });

    it("overwriteAll", async () => {
        let domain = "example.com";
        await getProxyBypassDomains().applyAll([domain]);

        let results = await getProxyBypassDomains().fetchAll();
        assert(results.length === 1);
        assert(results[0].name === domain);
    });
});
