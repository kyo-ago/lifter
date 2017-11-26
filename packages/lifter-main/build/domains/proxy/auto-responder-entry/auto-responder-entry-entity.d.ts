import { BaseEntity } from "../../base/base-entity";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponderParam } from "../local-file-responder/lifecycle/local-file-responder-factory";
import { ProjectIdentity } from "../project/project-identity";
import { AutoResponderEntryFilePath } from "./auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import { AutoResponderEntryIdentity } from "./auto-responder-entry-identity";
import { AutoResponderEntryPath } from "./value-objects/auto-responder-entry-path";
import { AutoResponderEntryPattern } from "./value-objects/auto-responder-entry-pattern";
export declare type AutoResponderEntryType = "File" | "Directory" | "Glob";
export declare type AbstractAutoResponderEntryEntity = AutoResponderEntryEntity<
    AutoResponderEntryPattern,
    AutoResponderEntryPath
>;
export interface AutoResponderEntryEntityJSON {
    id: number;
    type: AutoResponderEntryType;
    pattern: string;
    path: string;
    projectId: number;
}
export abstract class AutoResponderEntryEntity<
    Pattern extends AutoResponderEntryPattern,
    Path extends AutoResponderEntryPath
> extends BaseEntity<AutoResponderEntryIdentity> {
    type: AutoResponderEntryType;
    pattern: Pattern;
    path: Path;
    projectIdentity: ProjectIdentity;
    constructor(
        identity: AutoResponderEntryIdentity,
        type: AutoResponderEntryType,
        pattern: Pattern,
        path: Path,
        projectIdentity: ProjectIdentity
    );
    abstract getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null>;
    readonly json: AutoResponderEntryEntityJSON;
    protected filePathToLocalFileResponderParam(
        filePath: AutoResponderEntryFilePath
    ): Promise<LocalFileResponderParam | null>;
}
