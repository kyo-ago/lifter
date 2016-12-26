import * as mime from "mime";
import {Entity} from "typescript-dddbase";

import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {LocalFileResponderSize} from "./value-objects/local-file-responder-size";
import {LocalFileResponderPath} from "./value-objects/local-file-responder-path";
import {LocalFileResponderType} from "./value-objects/local-file-responder-type";

export class LocalFileResponderEntity extends Entity<LocalFileResponderIdentity> {
    constructor(
        identity: LocalFileResponderIdentity,
        private path: LocalFileResponderPath,
        private type: LocalFileResponderType,
        private size: LocalFileResponderSize,
    ) {
        super(identity);
    }

    getBody() {
        return this.path.getBody();
    }

    getHeader() {
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