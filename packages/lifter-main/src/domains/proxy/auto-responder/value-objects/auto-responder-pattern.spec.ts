import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderPattern } from "./auto-responder-pattern";

describe("AutoResponderPattern", () => {
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        clientRequestFactory = (await getTestContainer()).get(
            ClientRequestFactory,
        );
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
                let autoResponderPattern = new AutoResponderPattern(
                    pattern.pattern,
                );
                let result = autoResponderPattern.getMatchCodeString("match");
                let code = `((url) => {${result}})("${pattern.path}")`;
                assert(eval(code) === (pattern.result ? "match" : undefined));
            });
        });
    });

    describe("isMatchPath", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderPattern = new AutoResponderPattern(
                    pattern.pattern,
                );
                let clientRequestEntity = clientRequestFactory.createFromString(
                    pattern.path,
                );
                let result = autoResponderPattern.isMatchPath(
                    clientRequestEntity,
                );
                assert(result === pattern.result);
            });
        });
    });
});
