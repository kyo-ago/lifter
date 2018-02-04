import {CertificateStatus} from "@lifter/lifter-common";
import {NetworksetupProxyService} from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import {findCertificate, importCert} from "../../libs/exec-commands";
import {CERTIFICATE_NAME} from "../../settings";

export class CertificateService {
    private certificatePath: string;

    constructor(
        sslCaDir: string,
        private networksetupProxyService: NetworksetupProxyService,
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
        } else {
            await this.installCertificate();
        }
        return await this.getCurrentStatus();
    }

    private async findCertificate(): Promise<boolean> {
        try {
            let result = await findCertificate(CERTIFICATE_NAME);
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
            await this.networksetupProxyService.addTrustedCert(this.certificatePath);
            return true;
        } catch (e) {
            // user cancel
            if (e.stderr.match(/SecTrustSettingsSetTrustSettings/)) {
                await this.networksetupProxyService.deleteCertificate();
                return false;
            }
            throw e;
        }
    }

    private async deleteCertificate(): Promise<boolean> {
        try {
            await this.networksetupProxyService.deleteCertificate();
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
