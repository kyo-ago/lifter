import * as assert from "assert";
import "mocha";
import * as Path from "path";
import * as sinon from "sinon";
import * as URL from "url";
import { createApplication } from "../../../../tests/mocks/create-services";
import { LOCAL_PAC_FILE_URL } from "../../../settings";
import { AutoResponderService } from "../auto-responder/auto-responder-service";

import { ClientResponder } from "./client-responder";
import { ClientResponderContext } from "./lib/client-responder-context";

describe("ClientResponder.onRequest", () => {
    let clientResponder: ClientResponder;
    let autoResponderService: AutoResponderService;
    let sandbox = sinon.createSandbox();
    let clientResponderContext = sandbox.createStubInstance(ClientResponderContext);

    beforeEach(async () => {
        let application = await createApplication();
        clientResponder = application.getClientResponder();
        autoResponderService = application.getAutoResponderService();
    });
    afterEach(() => {
        sandbox.resetHistory();
    });

    it("onRequest.pass", async () => {
        clientResponderContext.getUrl.returns(URL.parse("http://example.com/"));
        await clientResponder.onRequest(clientResponderContext);
        assert(clientResponderContext.pass.calledOnce);
    });

    it("onRequest.response LOCAL_PAC_FILE_URL", async () => {
        clientResponderContext.getUrl.returns(URL.parse(LOCAL_PAC_FILE_URL));
        await clientResponder.onRequest(clientResponderContext);
        assert(clientResponderContext.response.calledOnce);
    });

    it("onRequest.response localfile", async () => {
        await autoResponderService.store([__filename]);
        clientResponderContext.getUrl.returns(URL.parse(`http://example.com/${Path.basename(__filename)}`));
        await clientResponder.onRequest(clientResponderContext);
        assert(clientResponderContext.response.calledOnce);
        let args = clientResponderContext.response.lastCall.args;
        assert("content-type" in args[0]);
        assert(args[0]["content-length"] === args[1].length);
    });

    it("onRequest.pass no match files", async () => {
        await autoResponderService.store([__filename]);
        clientResponderContext.getUrl.returns(URL.parse(`http://example.com/unknown.txt`));
        await clientResponder.onRequest(clientResponderContext);
        assert(clientResponderContext.pass.calledOnce);
        assert(clientResponderContext.response.notCalled);
    });
});
