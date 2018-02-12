import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { createLifecycleContextService } from "../../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryAnyPath } from "./auto-responder-entry-any-path";

describe("AutoResponderEntryAnyPath", () => {
    describe("getAutoResponderEntryFilePath", () => {
        let dirname = Path.basename(__dirname);
        let filename = Path.basename(__filename);

        let clientRequestFactory: ClientRequestFactory;
        beforeEach(async () => {
            clientRequestFactory = (await createLifecycleContextService()).clientRequestFactory;
        });

        [
            {
                name: "match file",
                path: __filename,
                request: `/${dirname}/${filename}`,
                result: __filename,
            },
            {
                name: "match unknown file",
                path: __filename,
                request: `/${dirname}/hoge.txt`,
                result: __filename,
            },
            {
                name: "match directory",
                path: __dirname,
                request: `/${dirname}/${filename}`,
                result: __filename,
            },
            {
                name: "match root directory",
                path: __dirname,
                request: `/${filename}`,
                result: __filename,
            },
        ].forEach(pattern => {
            it(pattern.name, async () => {
                let autoResponderEntryAnyPath = new AutoResponderEntryAnyPath(pattern.path);
                let clientRequestEntity = clientRequestFactory.createFromString(pattern.request);
                let result = await autoResponderEntryAnyPath.getAutoResponderEntryFilePath(clientRequestEntity);
                assert(result.value === pattern.result);
            });
        });

        it("unmatch directory", async () => {
            let autoResponderEntryAnyPath = new AutoResponderEntryAnyPath(__dirname);
            let clientRequestEntity = clientRequestFactory.createFromString(`/hoge/${filename}`);
            let result = await autoResponderEntryAnyPath.getAutoResponderEntryFilePath(clientRequestEntity);
            assert(result === null);
        });
    });
});
