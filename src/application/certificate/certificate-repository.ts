import * as Path from "path";

import {OnMemoryRepository} from "typescript-dddbase";
import {CertificateIdentity} from "./certificate-identity";
import {CertificateEntity} from "./certificate-entity";
import {KeychainEntity} from "./keychain/keychain-entity";
import {execSecurityCommand, IOResult} from "../../libs/exec-command";

export class CertificateRepository extends OnMemoryRepository<CertificateIdentity, CertificateEntity> {
    private certificatePath: string;
    private certificateName = 'NodeMITMProxyCA';

    constructor(userDataPath: string) {
        super();
        this.certificatePath = Path.join(userDataPath, '.http-mitm-proxy/certs/ca.pem');
    }

    findCertificate() {
        return execSecurityCommand([`find-certificate -c "${this.certificateName}"`]).then(({stdout, stderr}) => {
            if (stderr && stderr.match(/SecKeychainSearchCopyNext/)) {
                // missing Certificate
                return;
            }
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout;
        });
    }

    deleteCertificate() {
        return execSecurityCommand([`delete-certificate -c "${this.certificateName}"`]).then(({stdout, stderr}: IOResult) => {
            if (stderr && stderr.match(/Unable to delete certificate matching/)) {
                // missing Certificate
                return;
            }
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout;
        });
    }

    registerCertificate(keychainEntity: KeychainEntity) {
        let name = keychainEntity.name;
        let path = this.certificatePath;
        return execSecurityCommand([`add-trusted-cert -k "${name}" "${path}"`]).then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout;
        });
    }
}
