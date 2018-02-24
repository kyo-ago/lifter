import * as assert from "assert";
import "mocha";
import { createLifecycleContextService } from "../../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryFilePattern } from "./auto-responder-entry-file-pattern";

describe("AutoResponderEntryFilePattern", () => {
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
                let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern(pattern.pattern);
                let result = autoResponderEntryFilePattern.getMatchCodeString("match");
                let code = `((url) => {${result}})("${pattern.path}")`;
                assert(eval(code) === (pattern.result ? "match" : undefined));
            });
        });
        it("not file url", () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern("hoge.txt");
            let result = autoResponderEntryFilePattern.getMatchCodeString("match");
            let code = `((url) => {${result}})("/huga/hoge.txt/foo/bar")`;
            // this is a pre filter
            assert(eval(code) === "match");
        });
    });

    describe("isMatchPath", () => {
        testPattern.forEach(pattern => {
            it(pattern.name, () => {
                let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern(pattern.pattern);
                let clientRequestEntity = clientRequestFactory.createFromString(pattern.path);
                assert(autoResponderEntryFilePattern.isMatchPath(clientRequestEntity) === pattern.result);
            });
        });
        it("not file url", () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern("hoge.txt");
            let clientRequestEntity = clientRequestFactory.createFromString("/huga/hoge.txt/foo/bar");
            assert(autoResponderEntryFilePattern.isMatchPath(clientRequestEntity) === false);
        });
    });
});
