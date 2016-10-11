import {CertificateRepository} from "./certificate-repository";
import {KeychainRepository} from "../keychain/keychain-repository";
import {KeychainEntity} from "../keychain/keychain-entity";

export class CertificateService {
    private certificateRepository = new CertificateRepository();
    private keychainRepository = new KeychainRepository();

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