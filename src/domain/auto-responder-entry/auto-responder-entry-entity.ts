import {BaseEntity} from "../base/base-entity";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";
import {ProjectIdentity} from "../project/project-identity";
import {LocalFileResponderEntity} from '../local-file-responder/local-file-responder-entity';

export type AutoResponderEntryType = "File" | "Directory" | "Glob";

export abstract class AutoResponderEntryEntity extends BaseEntity<AutoResponderEntryIdentity> {
    public type: AutoResponderEntryType;

    constructor(
        identity: AutoResponderEntryIdentity,
        public pattern: AutoResponderEntryPattern,
        public path: AutoResponderEntryPath,
        public projectIdentity: ProjectIdentity,
    ) {
        super(identity);
    }

    abstract getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null>;

    getMatchStats(path: ClientRequestUrl) {
        return new Promise((resolve, reject) => {
            if (!this.pattern.isMatch(path)) {
                return resolve(null);
            }
            this.path.getState().then(resolve, reject);
        });
    }
}
