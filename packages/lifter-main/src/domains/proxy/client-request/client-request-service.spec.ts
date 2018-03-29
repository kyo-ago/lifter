import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import * as assert from "assert";
import "mocha";
import * as Path from "path";
import * as sinon from "sinon";
import * as URL from "url";
import { createApplication } from "../../../../test/mocks/create-services";
import { LOCAL_PAC_FILE_URL } from "../../../settings";
import { AutoResponderService } from "../auto-responder/auto-responder-service";
import { ClientResponderContext } from "./lib/client-responder-context";
import { ClientRequestService } from "./client-request-service";

describe("ClientRequestService", () => {
    let clientRequestService: ClientRequestService;
    let autoResponderService: AutoResponderService;
    let sandbox = sinon.createSandbox();
    let clientResponderContext = sandbox.createStubInstance(ClientResponderContext);

    beforeEach(async () => {
        let application = await createApplication();
        clientRequestService = application.getServiceContext().clientRequestService;
        autoResponderService = application.getServiceContext().autoResponderService;
        sandbox.resetHistory();
    });

    let getClientRequestService = () => {
        return clientRequestService.getClientRequestService();
    };

    it("fetchAll", async () => {
        let results = await getClientRequestService().fetchAll();
        assert(results);
        assert(results.length === 0);
    });

    it("subscribe", (done) => {
        let requestUrl = URL.parse("http://example.com");
        let promise = new Promise<ClientRequestEntityJSON>((resolve) => {
            getClientRequestService().subscribe(resolve);
        });
        promise.then((clientRequest: ClientRequestEntityJSON) => {
            assert(clientRequest.href === requestUrl.href);
            done();
        });
        clientRequestService.store(requestUrl);
    });

    it("onRequest.pass", async () => {
        clientResponderContext.getUrl.returns(URL.parse("http://example.com/"));
        await clientRequestService.onRequest(clientResponderContext);
        assert(clientResponderContext.pass.calledOnce);
    });

    it("onRequest.response LOCAL_PAC_FILE_URL", async () => {
        clientResponderContext.getUrl.returns(URL.parse(LOCAL_PAC_FILE_URL));
        await clientRequestService.onRequest(clientResponderContext);
        assert(clientResponderContext.response.calledOnce);
    });

    it("onRequest.response localfile", async () => {
        await autoResponderService.store([__filename]);
        clientResponderContext.getUrl.returns(URL.parse(`http://example.com/${Path.basename(__filename)}`));
        await clientRequestService.onRequest(clientResponderContext);
        assert(clientResponderContext.response.calledOnce);
        let args = clientResponderContext.response.lastCall.args;
        assert("content-type" in args[0]);
        assert(args[0]["content-length"] === args[1].length);
    });

    it("onRequest.pass no match files", async () => {
        await autoResponderService.store([__filename]);
        clientResponderContext.getUrl.returns(URL.parse(`http://example.com/unknown.txt`));
        await clientRequestService.onRequest(clientResponderContext);
        assert(clientResponderContext.pass.calledOnce);
        assert(clientResponderContext.response.notCalled);
    });
});
