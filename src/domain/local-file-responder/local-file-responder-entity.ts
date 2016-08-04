import {Entity} from "typescript-dddbase";
import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {AutoResponderEntryType} from "../auto-responder-entry/auto-responder-entry-type";
import {AutoResponderEntryPath} from "../auto-responder-entry/auto-responder-entry-path";
import {LocalFileResponderSize} from "./local-file-responder-size";
const mime = require('mime');

export class LocalFileResponderEntity extends Entity<LocalFileResponderIdentity> {
    constructor(
        identity: LocalFileResponderIdentity,
        private path: AutoResponderEntryPath,
        private type: AutoResponderEntryType,
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
        return this.size.getValue();
    }
}