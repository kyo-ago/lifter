const Fs = require('Fs');
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

    getStream() {
        return Fs.createReadStream(this.path);
    }

    getHeader() {
        return `${this.type}`;
    }
}