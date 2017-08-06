import {BaseEntity} from "../../../share/domain/base/base-entity";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";
import {ProjectIdentity} from "../project/project-identity";
import {LocalFileResponderParam} from "../local-file-responder/lifecycle/local-file-responder-factory";

export type AutoResponderEntryType = "File" | "Directory" | "Glob";

export abstract class AutoResponderEntryEntity extends BaseEntity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        public type: AutoResponderEntryType,
        public pattern: AutoResponderEntryPattern,
        public path: AutoResponderEntryPath,
        public projectIdentity: ProjectIdentity,
    ) {
        super(identity);
    }

    abstract getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderParam | null>;

    protected async getMatchStats(path: ClientRequestUrl) {
        if (!this.pattern.isMatch(path)) {
            return null;
        }

        return await this.path.getState();
    }
}
