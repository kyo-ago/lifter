import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { LocalFileResponseFactory } from "../../local-file-response/lifecycle/local-file-response-factory";
import { AutoResponderFactory } from "../lifecycle/auto-responder-factory";
import { FindMatchEntry } from "./find-match-entry";

describe("FindMatchEntry.getLocalFileResponse", () => {
    let autoResponderFactory: AutoResponderFactory;
    let localFileResponseFactory: LocalFileResponseFactory;
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        let container = await getTestContainer();
        autoResponderFactory = container.get(AutoResponderFactory);
        localFileResponseFactory = container.get(LocalFileResponseFactory);
        clientRequestFactory = container.get(ClientRequestFactory);
    });

    it("success", async () => {
        let abstractAutoResponderEntity = await autoResponderFactory.create(
            "/hoge",
            __filename,
        );
        let findMatchEntry = new FindMatchEntry(localFileResponseFactory);
        let localFileResponseEntity = await findMatchEntry.getLocalFileResponse(
            Promise.resolve(null),
            clientRequestFactory.createFromString("/hoge"),
            abstractAutoResponderEntity,
        );
        assert(localFileResponseEntity);
    });

    it("failed", async () => {
        let abstractAutoResponderEntity = await autoResponderFactory.create(
            "/hoge",
            __filename,
        );
        let findMatchEntry = new FindMatchEntry(localFileResponseFactory);
        let localFileResponseEntity = await findMatchEntry.getLocalFileResponse(
            Promise.resolve(null),
            clientRequestFactory.createFromString("/huga"),
            abstractAutoResponderEntity,
        );
        assert(!localFileResponseEntity);
    });
});
