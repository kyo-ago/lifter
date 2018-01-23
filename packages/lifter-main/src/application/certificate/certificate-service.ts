import { CertificateStatus } from "@lifter/lifter-common";
import { addTrustedCert, deleteCertificate, findCertificate, importCert } from "../../libs/exec-commands";

export class CertificateService {
    private certificatePath: string;
    private certificateName = "NodeMITMProxyCA";

    constructor(sslCaDir: string) {
        this.certificatePath = `${sslCaDir}/certs/ca.pem`;
    }

    async getCurrentStatus(): Promise<CertificateStatus> {
        let result = await this.findCertificate();
        return result ? "installed" : "missing";
    }

    async getNewStatus(): Promise<CertificateStatus> {
        let result = await this.findCertificate();
        if (result) {
            await this.deleteCertificate();
        } else {
            await this.installCertificate();
        }
        return await this.getCurrentStatus();
    }

    private async findCertificate(): Promise<boolean> {
        try {
            let result = await findCertificate(this.certificateName);
            return !!result;
        } catch (e) {
            // missing Certificate
            if (e.message.match(/SecKeychainSearchCopyNext/)) {
                return false;
            }
            throw e;
        }
    }

    private async installCertificate(): Promise<boolean> {
        let importResult = await importCert(this.certificatePath);
        if (!importResult.match(/1 certificate imported\./)) {
            throw new Error(importResult);
        }
        try {
            await addTrustedCert(this.certificatePath);
            return true;
        } catch (e) {
            // user cancel
            if (e.stderr.match(/SecTrustSettingsSetTrustSettings/)) {
                await deleteCertificate(this.certificateName);
                return false;
            }
            throw e;
        }
    }

    private async deleteCertificate(): Promise<boolean> {
        try {
            await deleteCertificate(this.certificateName);
            return true;
        } catch (e) {
            // missing Certificate
            if (e.message.match(/Unable to delete certificate matching/)) {
                return false;
            }
            throw e;
        }
    }
}
