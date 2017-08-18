import * as Path from "path";
import {ExecCommand} from "../../libs/exec-command";
import {ParseKeychainCommand} from "./specs/parse-keychain-command";

export type CertificateStatus = "missing" | "installed";

export class CertificateService {
    private certificatePath: string;
    private certificateName = 'NodeMITMProxyCA';

    constructor(
        userDataPath: string,
    ) {
        this.certificatePath = Path.join(userDataPath, '.http-mitm-proxy/certs/ca.pem');
    }

    async getCurrentStatus(): Promise<CertificateStatus> {
        let result = await this.hasCertificate();
        return result ? "installed" : "missing";
    }

    async getNewStatus(): Promise<CertificateStatus> {
        let result = await this.hasCertificate();
        if (result) {
            await this.deleteCertificate();
            return "missing";
        } else {
            await this.installCertificate();
            return "installed";
        }
    }

    private async hasCertificate(): Promise<boolean> {
        try {
            return !!await ExecCommand.findCertificate(this.certificateName);
        } catch(e) {
            // missing Certificate
            if (!e.message.match(/SecKeychainSearchCopyNext/)) throw e;
        }
        return false;
    }

    private async installCertificate(): Promise<boolean> {
        let keychainName = await this.getKeychainName();
        let result = await ExecCommand.addTrustedCert(
            keychainName,
            this.certificatePath,
        );
        return !!result;
    }

    private async deleteCertificate(): Promise<true> {
        try {
            await ExecCommand.deleteCertificate(this.certificateName);
        } catch(e) {
            // missing Certificate
            if (!e.message.match(/Unable to delete certificate matching/)) throw e;
        }
        return true;
    }

    private async getKeychainName(): Promise<string> {
        let result = await ExecCommand.listKeychains();
        return ParseKeychainCommand(result);
    }
}