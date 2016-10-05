import {OnMemoryRepository} from "typescript-dddbase";
import {CertificateIdentity, CertificateIdentity} from "./certificate-identity";
import {CertificateEntity} from "./certificate-entity";
const exec = require('child_process').exec;

export class CertificateRepository extends OnMemoryRepository<CertificateIdentity, CertificateEntity> {
    private keychainName: string;

    constructor() {
        super();
    }

    findCertificate() {
        (<any>exec)('/usr/bin/security list-keychains', (error, stdout, stderr) => {
            if (error !== null || stderr) {
                throw new Error(`${error}, ${stderr}`);
            }
            this.keychainName = stdout.split(/\r?\n/g).shift();
        });
    }

    deleteCertificate() {

    }

    registerCertificate() {

    }
}
