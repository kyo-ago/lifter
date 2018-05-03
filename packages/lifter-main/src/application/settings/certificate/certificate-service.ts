import { CertificateStatus } from "@lifter/lifter-common";
import { injectable } from "inversify";
import {
    addTrustedCert,
    deleteCertificate,
    findCertificate,
    getAddTrustedCertCommandString,
    getDeleteCertificateCommandString,
    getImportCertCommandString,
    importCert,
} from "../../../libs/exec-commands";
import { SslCertificatePath } from "../../../libs/ssl-certificate-path";

export interface getCertificateService {
    fetchCurrentStatus: () => Promise<CertificateStatus>;
    fetchCurrentCommands: () => Promise<string[]>;
    changeCertificateStatus: () => Promise<CertificateStatus>;
}

@injectable()
export class CertificateService {
    constructor(private sslCertificatePath: SslCertificatePath) {}

    getCertificateService(): getCertificateService {
        return {
            fetchCurrentStatus: (): Promise<CertificateStatus> => {
                return this.fetchCurrentStatus();
            },
            fetchCurrentCommands: (): Promise<string[]> => {
                return this.fetchCurrentCommands();
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

    private async fetchCurrentCommands(): Promise<string[]> {
        let result = await this.findCertificate();
        if (result) {
            return [getDeleteCertificateCommandString()];
        }
        let caPath = this.sslCertificatePath.getCaPath();
        return [
            getImportCertCommandString(caPath),
            getAddTrustedCertCommandString(caPath),
        ];
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
        let caPath = this.sslCertificatePath.getCaPath();
        let importResult = await importCert(caPath);
        if (!importResult.match(/1 certificate imported\./)) {
            throw new Error(importResult);
        }
        try {
            await addTrustedCert(caPath);
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
