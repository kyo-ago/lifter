import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderDirectoryPattern } from "./auto-responder-directory-pattern";

describe("AutoResponderDirectoryPattern", () => {
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        clientRequestFactory = (await getTestContainer()).get(ClientRequestFactory);
    });
    let testPattern = [
        {
            name: "match",
            pattern: "/hoge/",
            path: "/hoge/huga",
            result: true,
        },
        {
            name: "middle match",
            pattern: "/hoge/",
            path: "/foo/bar/hoge/huga/gege",
            result: true,
        },
    ];
    let isMatchPathPattern = [
        {
            name: "root url unmatch",
            pattern: "/",
            path: "/",
            result: false,
        },
        {
            name: "directory url unmatch",
            pattern: "/hoge/",
            path: "/hoge/",
            result: false,
        },
    ];

    describe("getMatchCodeString", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderDirectoryPattern = AutoResponderDirectoryPattern.createSafeValue(pattern.pattern);
                let result = autoResponderDirectoryPattern.getMatchCodeString("match");
                let code = `((url) => {${result}})("${pattern.path}")`;
                assert(eval(code) === (pattern.result ? "match" : undefined));
            });
        });
    });

    describe("isMatchPath", () => {
        testPattern.concat(isMatchPathPattern).forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderDirectoryPattern = AutoResponderDirectoryPattern.createSafeValue(pattern.pattern);
                let clientRequestEntity = clientRequestFactory.createFromString(pattern.path);
                assert(autoResponderDirectoryPattern.isMatchPath(clientRequestEntity) === pattern.result);
            });
        });
    });
});
