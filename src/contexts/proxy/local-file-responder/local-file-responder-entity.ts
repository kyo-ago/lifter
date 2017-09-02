import {OutgoingHttpHeaders} from "http";
import * as mime from "mime";
import {BaseEntity} from "../../share/domain/base/base-entity";
import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {LocalFileResponderPath} from "./value-objects/local-file-responder-path";
import {LocalFileResponderSize} from "./value-objects/local-file-responder-size";
import {LocalFileResponderType} from "./value-objects/local-file-responder-type";

export class LocalFileResponderEntity extends BaseEntity<LocalFileResponderIdentity> {
    constructor(
        identity: LocalFileResponderIdentity,
        public path: LocalFileResponderPath,
        public type: LocalFileResponderType,
        public size: LocalFileResponderSize,
    ) {
        super(identity);
    }

    getBody() {
        return this.path.getBody();
    }

    getHeader(): OutgoingHttpHeaders {
        return {
            'content-length': this.getContentLength(),
            'content-type': this.getContentType(),
        };
    }

    private getContentType() {
        return this.type.value || mime.lookup(this.path.value);
    }

    private getContentLength() {
        return this.size.value;
    }
}