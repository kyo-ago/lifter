import * as assert from "assert";
import { getLifecycleContextService } from "../../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryDirectoryPattern } from "./auto-responder-entry-directory-pattern";

describe("AutoResponderEntryDirectoryPattern", () => {
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        clientRequestFactory = (await getLifecycleContextService()).clientRequestFactory;
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
                let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue(
                    pattern.pattern,
                );
                let result = autoResponderEntryDirectoryPattern.getMatchCodeString("match");
                let code = `((url) => {${result}})("${pattern.path}")`;
                assert(eval(code) === (pattern.result ? "match" : undefined));
            });
        });
    });

    describe("isMatchPath", () => {
        testPattern.concat(isMatchPathPattern).forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue(
                    pattern.pattern,
                );
                let clientRequestEntity = clientRequestFactory.createFromString(pattern.path);
                assert(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestEntity) === pattern.result);
            });
        });
    });
});
