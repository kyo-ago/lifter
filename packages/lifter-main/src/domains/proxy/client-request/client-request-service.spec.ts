import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import * as assert from "assert";
import "mocha";
import * as Path from "path";
import * as sinon from "sinon";
import * as URL from "url";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { BIND_HOST_NAME, PROXY_PORT } from "../../../settings";
import { AutoResponderService } from "../auto-responder/auto-responder-service";
import { ClientRequestService } from "./client-request-service";
import { ClientResponderContext } from "./lib/client-responder-context";

describe("ClientRequestService", () => {
    let clientRequestService: ClientRequestService;
    let autoResponderService: AutoResponderService;
    let sandbox = sinon.createSandbox();
    let clientResponderContext = sandbox.createStubInstance(
        ClientResponderContext,
    );

    beforeEach(async () => {
        let container = await getTestContainer();
        clientRequestService = container.get(ClientRequestService);
        autoResponderService = container.get(AutoResponderService);
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

    it("subscribe", done => {
        let requestUrl = URL.parse("http://example.com");
        let promise = new Promise<ClientRequestEntityJSON>(resolve => {
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
        clientResponderContext.getUrl.returns(
            URL.parse(`http://${BIND_HOST_NAME}:${PROXY_PORT}/proxy.pac`),
        );
        await clientRequestService.onRequest(clientResponderContext);
        assert(clientResponderContext.response.calledOnce);
    });

    it("onRequest.response localfile", async () => {
        await autoResponderService.store([__filename]);
        clientResponderContext.getUrl.returns(
            URL.parse(`http://example.com/${Path.basename(__filename)}`),
        );
        await clientRequestService.onRequest(clientResponderContext);
        assert(clientResponderContext.response.calledOnce);
        let args = clientResponderContext.response.lastCall.args;
        assert("content-type" in args[0]);
        assert(args[0]["content-length"] === args[1].length);
    });

    it("onRequest.pass no match files", async () => {
        await autoResponderService.store([__filename]);
        clientResponderContext.getUrl.returns(
            URL.parse(`http://example.com/unknown.txt`),
        );
        await clientRequestService.onRequest(clientResponderContext);
        assert(clientResponderContext.pass.calledOnce);
        assert(clientResponderContext.response.notCalled);
    });
});
