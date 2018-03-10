import * as assert from "assert";
import "mocha";
import * as URL from "url";
import { createApplication, TestApplication } from "../../../../tests/mocks/create-services";
import { RewriteRuleFactory } from "./lifecycle/rewrite-rule-factory";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";
import { RewriteRuleService } from "./rewrite-rule-service";

describe("RewriteRuleService", () => {
    let application: TestApplication;

    let getHeader = async (url: string) => {
        let localFileResponse = application.lifecycleContextService.localFileResponseFactory.create({
            path: "/local/file/path.js",
            type: "application/javascript",
            size: 100,
        });
        let clientRequestEntity = application.lifecycleContextService.clientRequestFactory.create(URL.parse(url));
        return await application.getRewriteRuleService().getHeader(localFileResponse, clientRequestEntity);
    };

    beforeEach(async () => {
        application = await createApplication();
        await application.lifecycleContextService.rewriteRuleRepository.store(
            RewriteRuleFactory.fromJSON({
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
            }),
        );
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

    it("add modifier", async () => {
        await application.getRewriteRuleService().addModifier(1, "DELETE", {
            header: "bar",
        });
        let rewriteRule = await application.lifecycleContextService.rewriteRuleRepository.resolve(new RewriteRuleIdentity(1));
        let deletes = rewriteRule.json.modifier["DELETE"];
        assert(deletes[deletes.length - 1].header === "bar");
    });
});
