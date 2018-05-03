import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { getTestContainer } from "../../../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderAnyPath } from "./auto-responder-any-path";

describe("AutoResponderAnyPath", () => {
    describe("getAutoResponderFilePath", () => {
        let dirname = Path.basename(__dirname);
        let filename = Path.basename(__filename);

        let clientRequestFactory: ClientRequestFactory;
        beforeEach(async () => {
            clientRequestFactory = (await getTestContainer()).get(
                ClientRequestFactory,
            );
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
                let autoResponderAnyPath = new AutoResponderAnyPath(
                    pattern.path,
                );
                let clientRequestEntity = clientRequestFactory.createFromString(
                    pattern.request,
                );
                let result = await autoResponderAnyPath.getAutoResponderFilePath(
                    clientRequestEntity,
                );
                assert(result.value === pattern.result);
            });
        });

        it("unmatch directory", async () => {
            let autoResponderAnyPath = new AutoResponderAnyPath(__dirname);
            let clientRequestEntity = clientRequestFactory.createFromString(
                `/hoge/${filename}`,
            );
            let result = await autoResponderAnyPath.getAutoResponderFilePath(
                clientRequestEntity,
            );
            assert(result === null);
        });
    });
});
