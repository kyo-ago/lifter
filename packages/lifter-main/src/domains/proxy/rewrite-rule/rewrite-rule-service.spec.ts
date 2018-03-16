import * as assert from "assert";
import "mocha";
import * as URL from "url";
import { createApplication, TestApplication } from "../../../../tests/mocks/create-services";
import { RewriteRuleService } from "./rewrite-rule-service";

describe("RewriteRuleService", () => {
    let application: TestApplication;
    let rewriteRuleService: RewriteRuleService;

    let getHeader = async (url: string) => {
        let localFileResponse = application.getLifecycleContextService().localFileResponseFactory.create({
            path: "/local/file/path.js",
            type: "application/javascript",
            size: 100,
        });
        let clientRequestEntity = application.getLifecycleContextService().clientRequestFactory.create(URL.parse(url));
        return await rewriteRuleService.getHeader(localFileResponse, clientRequestEntity);
    };

    beforeEach(async () => {
        application = await createApplication();
        rewriteRuleService = application.getServiceContext().rewriteRuleService;
        await rewriteRuleService.getRewriteRules().add([{
            id: 1,
            url: "/hoge/huga.js",
            modifier: {
                "DELETE" : [
                    {
                        id: 1,
                        header: "content-length",
                    },
                    {
                        id: 2,
                        header: "foo",
                    },
                ],
                "UPDATE": [
                    {
                        id: 3,
                        header: "content-type",
                        value: "text/plain",
                    },
                    {
                        id: 4,
                        header: "hoge",
                        value: "huga",
                    },
                ],
            },
        }]);
    });

    it("getHeader match", async () => {
        let result = await getHeader("http://example.com/hoge/huga.js");
        assert(result["content-type"] === "text/plain");
        assert(result["hoge"] === "huga");
        assert(!result["foo"]);
    });

    it("getHeader unmatch", async () => {
        let result = await getHeader("http://example.com/foo.txt");
        assert(result["content-type"] === "application/javascript");
    });

    let getNetworksetupProxyService = () => {
        return rewriteRuleService.getRewriteRules();
    };

    it("add modifier", async () => {
        await getNetworksetupProxyService().addModifier(1, "DELETE", {
            header: "bar",
        });
        let rewriteRules = await getNetworksetupProxyService().fetchAll();
        let deletes = rewriteRules[0].modifier["DELETE"];
        assert(deletes[deletes.length - 1].header === "bar");
    });
});
