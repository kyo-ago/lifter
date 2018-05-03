import { OutgoingHttpHeaders } from "http";
import * as mime from "mime";
import { BaseEntity } from "../../base/base-entity";
import { LocalFilResponseIdentity } from "./local-file-response-identity";
import { LocalFileResponsePath } from "./value-objects/local-file-response-path";
import { LocalFileResponseSize } from "./value-objects/local-file-response-size";
import { LocalFileResponseType } from "./value-objects/local-file-response-type";

export class LocalFileResponseEntity extends BaseEntity<
    LocalFilResponseIdentity
> {
    constructor(
        identity: LocalFilResponseIdentity,
        private path: LocalFileResponsePath,
        private type: LocalFileResponseType,
        private size: LocalFileResponseSize,
    ) {
        super(identity);
    }

    getBody() {
        return this.path.getBody();
    }

    getHeader(): OutgoingHttpHeaders {
        return {
            "content-length": this.getContentLength(),
            "content-type": this.getContentType(),
        };
    }

    private getContentType() {
        return this.type.value || mime.getType(this.path.value);
    }

    private getContentLength() {
        return this.size.value;
    }
}
