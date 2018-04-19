import { HTTP_SSL_CA_DIR_NAME } from "../../settings";
import { BaseValueObject } from "../base/value-objects/base-value-object";
import * as Path from "path";

export class SslCertificatePath extends BaseValueObject<string> {
    getCaPath() {
        return Path.join(this.getCaDir(), 'certs', 'ca.pem');
    }

    getCaDir() {
        return Path.join(this.value, HTTP_SSL_CA_DIR_NAME);
    }
}
