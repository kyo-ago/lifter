import * as assert from "assert";
import "mocha";
import * as Path from "path";
import * as sinon from "sinon";
import { createApplication } from "../../../../test/mocks/create-services";
import { PROXY_SERVER_NAME } from "../../../settings";
import { AutoResponderService } from "../auto-responder/auto-responder-service";
import { ClientResponderContext } from "../client-request/lib/client-responder-context";
import { PacFileService } from "./pac-file-service";

describe("PacFileService", () => {
    let pacFileService: PacFileService;
    let autoResponderService: AutoResponderService;
    let sandbox = sinon.createSandbox();
    let clientResponderContext = sandbox.createStubInstance(ClientResponderContext);

    beforeEach(async () => {
        let application = await createApplication();
        pacFileService = application.getServiceContext().pacFileService;
        autoResponderService = application.getServiceContext().autoResponderService;
    });
    afterEach(() => {
        sandbox.resetHistory();
    });

    it("getContent.header", async () => {
        await pacFileService.response(clientResponderContext);
        let spyCall = clientResponderContext.response.lastCall;
        assert(spyCall.args[0]["content-length"] === spyCall.args[1].length);
        assert(spyCall.args[0]["content-type"] === "application/x-ns-proxy-autoconfig");
    });
    it("getContent.body", async () => {
        await autoResponderService.store([__filename]);
        await pacFileService.response(clientResponderContext);
        let spyCall = clientResponderContext.response.lastCall;
        let func = new Function(`return (${spyCall.args[1]})`);
        assert(func()("") === "DIRECT");
        let basename = Path.basename(__filename);
        assert(func()(`/${basename}`) === `PROXY ${PROXY_SERVER_NAME}`);
        assert(func()(`/${basename}.hoge`) === "DIRECT");
    });
});
