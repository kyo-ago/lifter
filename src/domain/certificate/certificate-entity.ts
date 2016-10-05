import {Entity} from "typescript-dddbase";
import {CertificateIdentity} from "./certificate-identity";

export class CertificateEntity extends Entity<CertificateIdentity> {
    constructor(
        identity: CertificateIdentity,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

}