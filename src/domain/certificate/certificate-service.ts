import {CertificateRepository} from "./certificate-repository";
import {KeychainRepository} from "./keychain/keychain-repository";
import {KeychainEntity} from "./keychain/keychain-entity";

export type CertificateStatus = "missing" | "installed";

export class CertificateService {
    private certificateRepository: CertificateRepository;
    private keychainRepository = new KeychainRepository();

    constructor(userDataPath: string) {
        this.certificateRepository = new CertificateRepository(userDataPath);
    }

    getCurrentStatus() {
        return new Promise<CertificateStatus>((resolve, reject) => {
            this.hasCertificate().then((result) => {
                resolve(result ? "installed" : "missing");
            });
        });
    }

    getNewStatus() {
        return new Promise<CertificateStatus>((resolve, reject) => {
            this.hasCertificate().then((result) => {
                if (result) {
                    this.deleteCertificate().then(() => {
                        resolve("missing");
                    });
                } else {
                    this.installCertificate().then(() => {
                        resolve("installed");
                    });
                }
            });
        });
    }

    hasCertificate() {
        return this.certificateRepository.findCertificate().then((result: string) => !!result);
    }

    installCertificate() {
        return this.keychainRepository.getKeychain().then((keychainEntity: KeychainEntity) => {
            return this.certificateRepository.registerCertificate(keychainEntity);
        }).then((result: string) => !!result);
    }

    deleteCertificate() {
        return this.certificateRepository.deleteCertificate().then(() => true);
    }
}