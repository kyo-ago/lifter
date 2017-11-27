import { addTrustedCert, deleteCertificate, findCertificate, importCert } from "../lib/exec-commands";

export type CertificateStatus = "missing" | "installed";

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
        return this.getCurrentStatus();
    }

    private async findCertificate(): Promise<boolean> {
        try {
            let result = await findCertificate(this.certificateName);
            return !!result;
        } catch (e) {
            // missing Certificate
            if (!e.message.match(/SecKeychainSearchCopyNext/)) throw e;
        }
        return false;
    }

    private async installCertificate(): Promise<boolean> {
        let importResult = await importCert(this.certificatePath);
        if (!importResult.match(/1 certificate imported\./)) {
            throw new Error(importResult);
        }
        try {
            await addTrustedCert(this.certificatePath);
            return false;
        } catch (e) {
            return true;
        }
    }

    private async deleteCertificate(): Promise<true> {
        try {
            await deleteCertificate(this.certificateName);
        } catch (e) {
            // missing Certificate
            if (!e.message.match(/Unable to delete certificate matching/)) throw e;
        }
        return true;
    }
}
