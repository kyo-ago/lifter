import * as assert from "assert";
import "mocha";
import * as URL from "url";
import { createApplication, TestApplication } from "../../../../tests/mocks/create-services";
import { RewriteRuleFactory } from "./lifecycle/rewrite-rule-factory";
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
                modifiers: [
                    {
                        id: 1,
                        action: "DELETE",
                        header: "content-length",
                    },
                    {
                        id: 2,
                        action: "UPDATE",
                        header: "content-type",
                        value: "text/plain",
                    },
                    {
                        id: 3,
                        action: "UPDATE",
                        header: "hoge",
                        value: "huga",
                    },
                    {
                        id: 4,
                        action: "DELETE",
                        header: "foo",
                    },
                ],
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
});
