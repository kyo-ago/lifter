import {addTrustedCert, deleteCertificate, findCertificate} from "../../../../../libs/exec-commands";

export type CertificateStatus = "missing" | "installed";

export class CertificateService {
    private certificatePath: string;
    private certificateName = 'NodeMITMProxyCA';

    constructor(
        sslCaDir: string,
    ) {
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
            return "missing";
        } else {
            await this.installCertificate();
            return "installed";
        }
    }

    private async findCertificate(): Promise<boolean> {
        try {
            let result = await findCertificate(this.certificateName);
            return !!result;
        } catch(e) {
            // missing Certificate
            if (!e.message.match(/SecKeychainSearchCopyNext/)) throw e;
        }
        return false;
    }

    private async installCertificate(): Promise<boolean> {
        let result = await addTrustedCert(this.certificatePath);
        return !!result;
    }

    private async deleteCertificate(): Promise<true> {
        try {
            await deleteCertificate(this.certificateName);
        } catch(e) {
            // missing Certificate
            if (!e.message.match(/Unable to delete certificate matching/)) throw e;
        }
        return true;
    }
}