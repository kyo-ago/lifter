import "mocha";
import * as assert from "assert";
import * as Path from "path";
import { createLifecycleContextService } from "../../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryDirectoryPath } from "./auto-responder-entry-directory-path";

describe("AutoResponderEntryDirectoryPath", () => {
    describe("getAutoResponderEntryFilePath", () => {
        let clientRequestFactory: ClientRequestFactory;
        beforeEach(async () => {
            clientRequestFactory = (await createLifecycleContextService()).clientRequestFactory;
        });

        let dirname = Path.basename(__dirname);
        let filename = Path.basename(__filename);
        it("root url", () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let clientRequestEntity = clientRequestFactory.createFromString(`/${dirname}/${filename}`);
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(clientRequestEntity);
            assert(result.value === __filename);
        });
        it("sub url", () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let clientRequestEntity = clientRequestFactory.createFromString(`/sub/${dirname}/${filename}`);
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(clientRequestEntity);
            assert(result.value === __filename);
        });
        it("unknow file", () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let clientRequestEntity = clientRequestFactory.createFromString(`/sub/${dirname}/unknow.txt`);
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(clientRequestEntity);
            assert(result.value === `${__dirname}/unknow.txt`);
        });
    });
});
