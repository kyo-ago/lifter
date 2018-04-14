import { CertificateStatus } from "@lifter/lifter-common";
import { addTrustedCert, deleteCertificate, findCertificate, importCert } from "../../../libs/exec-commands";

export interface getCertificateService {
    fetchCurrentStatus: () => Promise<CertificateStatus>;
    changeCertificateStatus: () => Promise<CertificateStatus>;
}

export class CertificateService {
    private certificatePath: string;

    constructor(sslCaDir: string) {
        this.certificatePath = `${sslCaDir}/certs/ca.pem`;
    }

    getCertificateService(): getCertificateService {
        return {
            fetchCurrentStatus: (): Promise<CertificateStatus> => {
                return this.fetchCurrentStatus();
            },
            changeCertificateStatus: (): Promise<CertificateStatus> => {
                return this.changeCertificateStatus();
            },
        };
    }

    private async fetchCurrentStatus(): Promise<CertificateStatus> {
        let result = await this.findCertificate();
        return result ? "Installed" : "Missing";
    }

    private async changeCertificateStatus(): Promise<CertificateStatus> {
        let result = await this.findCertificate();
        if (result) {
            await this.deleteCertificate();
        } else {
            await this.installCertificate();
        }
        return await this.fetchCurrentStatus();
    }

    private async findCertificate(): Promise<boolean> {
        try {
            let result = await findCertificate();
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
            if (e.message.match(/SecTrustSettingsSetTrustSettings/)) {
                await deleteCertificate();
                return false;
            }
            throw e;
        }
    }

    private async deleteCertificate(): Promise<boolean> {
        try {
            await deleteCertificate();
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
