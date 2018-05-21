import * as assert from "assert";
import "mocha";
import * as Path from "path";
import * as sinon from "sinon";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { PROXY_SERVER_NAME } from "../../../settings";
import { AutoResponderService } from "../../proxy/auto-responder/auto-responder-service";
import { ClientResponderContext } from "../../proxy/client-request/lib/client-responder-context";
import { PacFileService } from "./pac-file-service";

describe("PacFileService", () => {
    let pacFileService: PacFileService;
    let autoResponderService: AutoResponderService;
    let sandbox = sinon.createSandbox();
    let clientResponderContext = sandbox.createStubInstance(
        ClientResponderContext,
    );

    beforeEach(async () => {
        let container = await getTestContainer();
        pacFileService = container.get(PacFileService);
        autoResponderService = container.get(AutoResponderService);
    });
    afterEach(() => {
        sandbox.resetHistory();
    });

    it("getContent.header", async () => {
        await pacFileService.response(clientResponderContext);
        let spyCall = clientResponderContext.response.lastCall;
        assert(spyCall.args[0]["content-length"] === spyCall.args[1].length);
        assert(
            spyCall.args[0]["content-type"] ===
                "application/x-ns-proxy-autoconfig",
        );
    });
    it("getContent.body", async () => {
        await autoResponderService.store([__filename]);
        await pacFileService.response(clientResponderContext);
        let spyCall = clientResponderContext.response.lastCall;
        let func = new Function(`return (${spyCall.args[1]})`);
        assert(func()("") === "DIRECT");
        let basename = Path.basename(__filename);
        assert(func()(`/${basename}`) === `PROXY ${PROXY_SERVER_NAME}`);
        assert(func()(`/hoge/${basename}`) === `PROXY ${PROXY_SERVER_NAME}`);
        assert(func()(`/${basename}.hoge`) === "DIRECT");
        assert(func()(`/hoge/${basename}.hoge`) === "DIRECT");
    });
});
