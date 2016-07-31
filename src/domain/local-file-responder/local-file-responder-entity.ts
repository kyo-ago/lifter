const fs = require('fs');
import {Entity} from "typescript-dddbase";
import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {AutoResponderEntryType} from "../auto-responder-entry/auto-responder-entry-type";
import {AutoResponderEntryPath} from "../auto-responder-entry/auto-responder-entry-path";

export class LocalFileResponderEntity extends Entity<LocalFileResponderIdentity> {
    constructor(
        identity: LocalFileResponderIdentity,
        private path: AutoResponderEntryPath,
        private type: AutoResponderEntryType,
    ) {
        super(identity);
    }

    getBody() {
        return this.path.getBody();
    }

    getContentType() {
        return this.type.getValue();
    }
}