import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../test/mocks/create-services";
import { MockStateEvent } from "../../../../test/mocks/mock-state-event";
import { CertificateService } from "./certificate-service";

describe("CertificateService", () => {
    let certificateService: CertificateService;
    beforeEach(async () => {
        let application = await createApplication();
        certificateService = application.getServiceContext().certificateService;
    });

    let getCertificateService = () => {
        return certificateService.getCertificateService();
    };

    it("fetch", async () => {
        let result = await getCertificateService().fetchCurrentStatus();
        assert(result === "missing");
    });

    it("change missing to installed", async () => {
        MockStateEvent.emit("updateCertificateState", "missing");
        let result = await getCertificateService().changeCertificateStatus();
        assert(result === "installed");
    });

    it("change installed to missing", async () => {
        MockStateEvent.emit("updateCertificateState", "installed");
        let result = await getCertificateService().changeCertificateStatus();
        assert(result === "missing");
    });

    it("change to fetch", async () => {
        MockStateEvent.emit("updateCertificateState", "missing");
        let result = await getCertificateService().changeCertificateStatus();
        assert(result === "installed");

        let fetchResult = await getCertificateService().fetchCurrentStatus();
        assert(fetchResult === "installed");
    });
});
