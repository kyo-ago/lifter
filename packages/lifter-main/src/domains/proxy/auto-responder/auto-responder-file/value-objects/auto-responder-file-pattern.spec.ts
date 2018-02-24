import * as assert from "assert";
import "mocha";
import { createLifecycleContextService } from "../../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderFilePattern } from "./auto-responder-file-pattern";

describe("AutoResponderFilePattern", () => {
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        clientRequestFactory = (await createLifecycleContextService()).clientRequestFactory;
    });
    let testPattern = [
        {
            name: "match",
            pattern: "hoge.txt",
            path: "/hoge.txt",
            result: true,
        },
        {
            name: "unmatch",
            pattern: "hoge.txt",
            path: "/",
            result: false,
        },
        {
            name: "directory",
            pattern: "hoge.txt",
            path: "/huga/hoge.txt",
            result: true,
        },
        {
            name: "regexp charactor",
            pattern: ".",
            path: "/",
            result: false,
        },
    ];

    describe("getMatchCodeString", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderFilePattern = new AutoResponderFilePattern(pattern.pattern);
                let result = autoResponderFilePattern.getMatchCodeString("match");
                let code = `((url) => {${result}})("${pattern.path}")`;
                assert(eval(code) === (pattern.result ? "match" : undefined));
            });
        });
        it("not file url", () => {
            let autoResponderFilePattern = new AutoResponderFilePattern("hoge.txt");
            let result = autoResponderFilePattern.getMatchCodeString("match");
            let code = `((url) => {${result}})("/huga/hoge.txt/foo/bar")`;
            // this is a pre filter
            assert(eval(code) === "match");
        });
    });

    describe("isMatchPath", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderFilePattern = new AutoResponderFilePattern(pattern.pattern);
                let clientRequestEntity = clientRequestFactory.createFromString(pattern.path);
                assert(autoResponderFilePattern.isMatchPath(clientRequestEntity) === pattern.result);
            });
        });
        it("not file url", () => {
            let autoResponderFilePattern = new AutoResponderFilePattern("hoge.txt");
            let clientRequestEntity = clientRequestFactory.createFromString("/huga/hoge.txt/foo/bar");
            assert(autoResponderFilePattern.isMatchPath(clientRequestEntity) === false);
        });
    });
});
