import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { getTestContainer } from "../../../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderDirectoryPath } from "./auto-responder-directory-path";

describe("AutoResponderDirectoryPath", () => {
    describe("getAutoResponderFilePath", () => {
        let clientRequestFactory: ClientRequestFactory;
        beforeEach(async () => {
            clientRequestFactory = (await getTestContainer()).get(
                ClientRequestFactory,
            );
        });

        let dirname = Path.basename(__dirname);
        let filename = Path.basename(__filename);
        it("root url", () => {
            let autoResponderDirectoryPath = new AutoResponderDirectoryPath(
                __dirname,
            );
            let clientRequestEntity = clientRequestFactory.createFromString(
                `/${dirname}/${filename}`,
            );
            let result = autoResponderDirectoryPath.getAutoResponderFilePath(
                clientRequestEntity,
            );
            assert(result.value === __filename);
        });
        it("sub url", () => {
            let autoResponderDirectoryPath = new AutoResponderDirectoryPath(
                __dirname,
            );
            let clientRequestEntity = clientRequestFactory.createFromString(
                `/sub/${dirname}/${filename}`,
            );
            let result = autoResponderDirectoryPath.getAutoResponderFilePath(
                clientRequestEntity,
            );
            assert(result.value === __filename);
        });
        it("unknow file", () => {
            let autoResponderDirectoryPath = new AutoResponderDirectoryPath(
                __dirname,
            );
            let clientRequestEntity = clientRequestFactory.createFromString(
                `/sub/${dirname}/unknow.txt`,
            );
            let result = autoResponderDirectoryPath.getAutoResponderFilePath(
                clientRequestEntity,
            );
            assert(result.value === `${__dirname}/unknow.txt`);
        });
    });
});
