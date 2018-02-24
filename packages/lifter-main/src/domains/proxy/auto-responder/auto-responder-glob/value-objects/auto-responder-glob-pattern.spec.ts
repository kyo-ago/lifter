import * as assert from "assert";
import "mocha";
import { createLifecycleContextService } from "../../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderGlobPattern } from "./auto-responder-glob-pattern";

describe("AutoResponderGlobPattern", () => {
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        clientRequestFactory = (await createLifecycleContextService()).clientRequestFactory;
    });
    let testPattern = [
        {
            name: "match",
            pattern: "/*",
            path: "/hoge",
            result: true,
        },
        {
            name: "directory match",
            pattern: "/*/",
            path: "/hoge/",
            result: true,
        },
        {
            name: "multi directory match",
            pattern: "/**",
            path: "/hoge/huga.js",
            result: true,
        },
        {
            name: "extension match",
            pattern: "*.js",
            path: "/hoge/huga.js",
            result: true,
        },
        {
            name: "extension match",
            pattern: "*.js",
            path: "/hoge/huga.js",
            result: true,
        },
        {
            name: "unmatch",
            pattern: "/hoge/*",
            path: "/huga",
            result: false,
        },
    ];

    describe("getMatchCodeString", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderGlobPattern = new AutoResponderGlobPattern(pattern.pattern);
                let result = autoResponderGlobPattern.getMatchCodeString("match");
                let code = `((url) => {${result}})("${pattern.path}")`;
                assert(eval(code) === (pattern.result ? "match" : undefined));
            });
        });
    });

    describe("isMatchPath", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderGlobPattern = new AutoResponderGlobPattern(pattern.pattern);
                let clientRequestEntity = clientRequestFactory.createFromString(pattern.path);
                let result = autoResponderGlobPattern.isMatchPath(clientRequestEntity);
                assert(result === pattern.result);
            });
        });
    });
});
