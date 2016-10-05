import {CertificateEntity} from "./certificate-entity";
import {CertificateIdentity} from "./certificate-identity";

export class CertificateFactory {
    private static identity = 0;

    static create(): CertificateEntity {
        return new CertificateEntity(
            new CertificateIdentity(this.identity++),
        );
    }
}