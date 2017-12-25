import { BaseEntity } from "@kyo-ago/lifter-common";
import { OutgoingHttpHeaders } from "http";
import * as mime from "mime";
import { LocalFileResponderIdentity } from "./local-file-responder-identity";
import { LocalFileResponderPath } from "./value-objects/local-file-responder-path";
import { LocalFileResponderSize } from "./value-objects/local-file-responder-size";
import { LocalFileResponderType } from "./value-objects/local-file-responder-type";

export class LocalFileResponderEntity extends BaseEntity<LocalFileResponderIdentity> {
    constructor(
        identity: LocalFileResponderIdentity,
        private path: LocalFileResponderPath,
        private type: LocalFileResponderType,
        private size: LocalFileResponderSize
    ) {
        super(identity);
    }

    getBody() {
        return this.path.getBody();
    }

    getHeader(): OutgoingHttpHeaders {
        return {
            "content-length": this.getContentLength(),
            "content-type": this.getContentType()
        };
    }

    private getContentType() {
        return this.type.value || mime.getType(this.path.value);
    }

    private getContentLength() {
        return this.size.value;
    }
}
