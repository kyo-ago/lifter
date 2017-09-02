import * as mime from "mime";
import {BaseEntity} from "../../share/domain/base/base-entity";
import {ClientRequestEntity} from "../client-request/client-request-entity";
import {LocalFileResponderParam} from "../local-file-responder/lifecycle/local-file-responder-factory";
import {ProjectIdentity} from "../project/project-identity";
import {AutoResponderEntryFilePath} from "./auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";

export type AutoResponderEntryType = "File" | "Directory" | "Glob";

export type AbstractAutoResponderEntryEntity = AutoResponderEntryEntity<AutoResponderEntryPattern, AutoResponderEntryPath>;

export abstract class AutoResponderEntryEntity<
        Pattern extends AutoResponderEntryPattern,
        Path extends AutoResponderEntryPath
    > extends BaseEntity<AutoResponderEntryIdentity> {
    constructor(
        identity: AutoResponderEntryIdentity,
        public type: AutoResponderEntryType,
        public pattern: Pattern,
        public path: Path,
        public projectIdentity: ProjectIdentity,
    ) {
        super(identity);
    }

    abstract getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null>;

    protected async filePathToLocalFileResponderParam(filePath: AutoResponderEntryFilePath): Promise<LocalFileResponderParam | null> {
        let stats;
        try {
            stats = await filePath.getState();
        } catch (e) {
            // missing file
            return null;
        }
        return {
            path: filePath.value,
            type: mime.lookup(filePath.value),
            size: stats.size,
        };
    }
}
