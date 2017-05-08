import * as fs from "fs";
import {BaseEntity} from "../../base/base-entity";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {LocalFileResponderEntity} from "../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";

export class AutoResponderEntryBaseEntity extends BaseEntity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        public pattern: AutoResponderEntryPattern,
        public path: AutoResponderEntryPath,
    ) {
        super(identity);
    }

    getMatchStats(path: ClientRequestUrl) {
        return new Promise((resolve, reject) => {
            if (!this.pattern.isMatch(path)) {
                return resolve(null);
            }
            this.path.getState().then(resolve, reject);
        });
    }
}
