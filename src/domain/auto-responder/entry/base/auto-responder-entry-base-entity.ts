import {BaseEntity} from "../../../base/base-entity";

import {AutoResponderEntryBaseIdentity} from "./auto-responder-entry-base-identity";
import {AutoResponderEntryBasePattern} from "./value-objects/auto-responder-entry-base-pattern";
import {AutoResponderEntryBasePath} from "./value-objects/auto-responder-entry-base-path";
import {AutoResponderEntryBaseType} from "./value-objects/auto-responder-entry-base-type";
import {LocalFileResponderEntity} from "../../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";

export type AutoResponderEntryEntity = AutoResponderEntryBaseEntity<AutoResponderEntryBaseIdentity>;

export class AutoResponderEntryBaseEntity<ID extends AutoResponderEntryBaseIdentity> extends BaseEntity<ID> {
    constructor(
        identity: ID,
        protected _pattern: AutoResponderEntryBasePattern,
        protected _path: AutoResponderEntryBasePath,
        protected _type: AutoResponderEntryBaseType,
    ) {
        super(identity);
    }

    get pattern() {
        return this._pattern.value;
    }

    get path() {
        return this._path.value;
    }

    get type() {
        return this._type.value;
    }

    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        throw new Error("Invalid call");
    }

    protected getMatchStats(path: ClientRequestUrl) {
        return new Promise((resolve, reject) => {
            if (!this._pattern.isMatch(path)) {
                return resolve(null);
            }
            this._path.getState().then(resolve, reject);
        });
    }
}