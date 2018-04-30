import * as Path from "path";
import { BaseValueObject } from "../domains/base/value-objects/base-value-object";
import { HTTP_SSL_CA_DIR_NAME } from "../settings";

export class SslCertificatePath extends BaseValueObject<string> {
    getCaPath() {
        return Path.join(this.getCaDir(), 'certs', 'ca.pem');
    }

    getCaDir() {
        return Path.join(this.value, HTTP_SSL_CA_DIR_NAME);
    }
}
