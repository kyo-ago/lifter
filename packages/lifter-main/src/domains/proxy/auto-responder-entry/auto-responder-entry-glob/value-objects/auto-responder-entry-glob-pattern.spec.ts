import * as assert from "assert";
import { getLifecycleContextService } from "../../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryGlobPattern } from "./auto-responder-entry-glob-pattern";

describe("AutoResponderEntryGlobPattern", () => {
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        clientRequestFactory = (await getLifecycleContextService()).clientRequestFactory;
    });
    let testPattern = [
        {
            name: "match",
            pattern: "/*",
            path: "/hoge",
            result: true
        },
        {
            name: "directory match",
            pattern: "/*/",
            path: "/hoge/",
            result: true
        },
        {
            name: "multi directory match",
            pattern: "/**",
            path: "/hoge/huga.js",
            result: true
        },
        {
            name: "extension match",
            pattern: "*.js",
            path: "/hoge/huga.js",
            result: true
        },
        {
            name: "extension match",
            pattern: "*.js",
            path: "/hoge/huga.js",
            result: true
        },
        {
            name: "unmatch",
            pattern: "/hoge/*",
            path: "/huga",
            result: false
        }
    ];

    describe("getMatchCodeString", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern(pattern.pattern);
                let result = autoResponderEntryGlobPattern.getMatchCodeString("match");
                let code = `((url) => {${result}})("${pattern.path}")`;
                assert(eval(code) === (pattern.result ? "match" : undefined));
            });
        });
    });

    describe("isMatchPath", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern(pattern.pattern);
                let clientRequestEntity = clientRequestFactory.createFromString(pattern.path);
                let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestEntity);
                assert(result === pattern.result);
            });
        });
    });
});
