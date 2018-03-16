import * as assert from "assert";
import "mocha";
import * as URL from "url";
import { createApplication } from "../../../../tests/mocks/create-services";
import { ClientRequestEntity } from "./client-request-entity";
import { ClientRequestService } from "./client-request-service";

describe("ClientRequestService", () => {
    let clientRequestService: ClientRequestService;
    beforeEach(async () => {
        let application = await createApplication();
        clientRequestService = application.getServiceContext().clientRequestService;
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
        let promise = new Promise<ClientRequestEntity>((resolve) => {
            getClientRequestService().subscribe(resolve);
        });
        promise.then((clientRequestEntity: ClientRequestEntity) => {
            assert(clientRequestEntity.href === requestUrl.href);
            done();
        });
        clientRequestService.store(requestUrl);
    });
});
