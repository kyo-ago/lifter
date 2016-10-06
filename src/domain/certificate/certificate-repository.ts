import {OnMemoryRepository} from "typescript-dddbase";
import {CertificateIdentity, CertificateIdentity} from "./certificate-identity";
import {CertificateEntity} from "./certificate-entity";
import {KeychainEntity} from "../keychain/keychain-entity";
import {execCommand} from "../../libs/execCommand";

export class CertificateRepository extends OnMemoryRepository<CertificateIdentity, CertificateEntity> {
    private certificateName = 'NodeMITMProxyCA';
    private certificatePath = '.http-mitm-proxy/certs/ca.pem';

    findCertificate() {
        return execCommand(`find-certificate -c ${this.certificateName}`, (resolve, reject, { error, stdout, stderr }) => {
            if (stderr && stderr.match(/SecKeychainSearchCopyNext/)) {
                // missing Certificate
                resolve();
            }
            if (error !== null || stderr) {
                reject(`${error}, ${stderr}`);
            }
            resolve(stdout);
        });
    }

    deleteCertificate() {
        return execCommand(`delete-certificate -c ${this.certificateName}`, (resolve, reject, { error, stdout, stderr }) => {
            if (stderr && stderr.match(/Unable to delete certificate matching/)) {
                // missing Certificate
                resolve(stderr);
            }
            if (error !== null || stderr) {
                reject(`${error}, ${stderr}`);
            }
            resolve(stdout);
        });
    }

    registerCertificate(keychainEntity: KeychainEntity) {
        let name = keychainEntity.name;
        let path = this.certificatePath;
        return execCommand(`add-trusted-cert -k ${name} ${path}`, (resolve, reject, { error, stdout, stderr }) => {
            if (stderr && stderr.match(/Unable to delete certificate matching/)) {
                // missing Certificate
                resolve(stderr);
            }
            if (error !== null || stderr) {
                reject(`${error}, ${stderr}`);
            }
            resolve(stdout);
        });
    }
}
