jest.mock("../../libs/exec-commands");
import {findCertificate} from "../../libs/exec-commands";
import { CertificateService } from "./certificate-service";

describe("CertificateService", () => {
    let certificateService: CertificateService;
    beforeEach(() => {
        delete (<any>findCertificate).current;
        certificateService = new CertificateService("");
    });

    describe("getCurrentStatus", () => {
        it("success", async () => {
            let result = await certificateService.getCurrentStatus();
            expect(result).toBe("installed");
        });
        it("failed", async () => {
            (<any>findCertificate).current = "missing certificate";
            let result = await certificateService.getCurrentStatus();
            expect(result).toBe("missing");
        });
    });

    describe("getNewStatus", () => {
        it("missing to installed", async () => {
            let result = await certificateService.getNewStatus();
            expect(result).toBe("installed");
        });
        it("installed to missing", async () => {
            (<any>findCertificate).current = "missing certificate";
            let result = await certificateService.getNewStatus();
            expect(result).toBe("missing");
        });
    });
});
