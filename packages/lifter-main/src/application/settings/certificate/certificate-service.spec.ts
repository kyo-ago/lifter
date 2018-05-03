import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { MockStateEvent } from "../../../../test/mocks/mock-state-event";
import { CertificateService } from "./certificate-service";

describe("CertificateService", () => {
    let certificateService: CertificateService;
    beforeEach(async () => {
        let container = await getTestContainer();
        certificateService = container.get(CertificateService);
    });

    let getCertificateService = () => {
        return certificateService.getCertificateService();
    };

    it("fetch", async () => {
        let result = await getCertificateService().fetchCurrentStatus();
        assert(result === "Missing");
    });

    it("change Missing to Installed", async () => {
        MockStateEvent.emit("updateCertificateState", "Missing");
        let result = await getCertificateService().changeCertificateStatus();
        assert(result === "Installed");
    });

    it("change Installed to Missing", async () => {
        MockStateEvent.emit("updateCertificateState", "Installed");
        let result = await getCertificateService().changeCertificateStatus();
        assert(result === "Missing");
    });

    it("change to fetch", async () => {
        MockStateEvent.emit("updateCertificateState", "Missing");
        let result = await getCertificateService().changeCertificateStatus();
        assert(result === "Installed");

        let fetchResult = await getCertificateService().fetchCurrentStatus();
        assert(fetchResult === "Installed");
    });
});
