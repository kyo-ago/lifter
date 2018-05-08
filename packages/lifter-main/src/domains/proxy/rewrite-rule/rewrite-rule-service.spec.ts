import {
    CreateRewriteRuleDeleteModifierEntityJSON,
    CreateRewriteRuleUpdateModifierEntityJSON,
} from "@lifter/lifter-common";
import * as assert from "assert";
import "mocha";
import * as URL from "url";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../client-request/lifecycle/client-request-factory";
import { LocalFileResponseFactory } from "../local-file-response/lifecycle/local-file-response-factory";
import { RewriteRuleService } from "./rewrite-rule-service";

describe("RewriteRuleService", () => {
    let rewriteRuleService: RewriteRuleService;
    let localFileResponseFactory: LocalFileResponseFactory;
    let clientRequestFactory: ClientRequestFactory;

    let getHeader = async (url: string) => {
        let localFileResponse = localFileResponseFactory.create({
            path: "/local/file/path.js",
            type: "application/javascript",
            size: 100,
        });
        let clientRequestEntity = clientRequestFactory.create(URL.parse(url));
        return await rewriteRuleService.getHeader(
            localFileResponse,
            clientRequestEntity,
        );
    };

    beforeEach(async () => {
        let container = await getTestContainer();
        rewriteRuleService = container.get(RewriteRuleService);
        localFileResponseFactory = container.get(LocalFileResponseFactory);
        clientRequestFactory = container.get(ClientRequestFactory);
    });

    it("getHeader match", async () => {
        await rewriteRuleService.getRewriteRules().addRule("/hoge/huga.js");
        let result = await getHeader("http://example.com/hoge/huga.js");
        assert(result["content-type"] === "application/javascript");
    });

    it("getHeader match update", async () => {
        let entity = await rewriteRuleService
            .getRewriteRules()
            .addRule("/hoge/huga.js");
        await rewriteRuleService
            .getRewriteRules()
            .addModifier(
                "UPDATE",
                entity.id,
                <CreateRewriteRuleUpdateModifierEntityJSON>{
                    header: "content-type",
                    value: "text/plain",
                },
            );
        let result = await getHeader("http://example.com/hoge/huga.js");
        assert(result["content-type"] === "text/plain");
    });

    it("getHeader match append", async () => {
        let entity = await rewriteRuleService
            .getRewriteRules()
            .addRule("/hoge/huga.js");
        await rewriteRuleService
            .getRewriteRules()
            .addModifier(
                "UPDATE",
                entity.id,
                <CreateRewriteRuleUpdateModifierEntityJSON>{
                    header: "hoge",
                    value: "huga",
                },
            );
        let result = await getHeader("http://example.com/hoge/huga.js");
        assert(result["hoge"] === "huga");
    });

    it("getHeader match delete", async () => {
        let entity = await rewriteRuleService
            .getRewriteRules()
            .addRule("/hoge/huga.js");
        await rewriteRuleService
            .getRewriteRules()
            .addModifier(
                "DELETE",
                entity.id,
                <CreateRewriteRuleDeleteModifierEntityJSON>{
                    header: "content-type",
                },
            );
        let result = await getHeader("http://example.com/hoge/huga.js");
        assert(!("hoge" in result));
    });

    it("getHeader unmatch", async () => {
        await rewriteRuleService.getRewriteRules().addRule("/hoge/huga.js");
        let result = await getHeader("http://example.com/foo.txt");
        assert(result["content-type"] === "application/javascript");
    });

    let getNetworksetupProxyService = () => {
        return rewriteRuleService.getRewriteRules();
    };

    it("add modifier", async () => {
        let entity = await rewriteRuleService
            .getRewriteRules()
            .addRule("/hoge/huga.js");
        await getNetworksetupProxyService().addModifier("DELETE", entity.id, {
            header: "bar",
        });
        let rewriteRules = await getNetworksetupProxyService().fetchAll();
        let deletes = rewriteRules[0].modifier["DELETE"];
        assert(deletes[deletes.length - 1].header === "bar");
    });
});
