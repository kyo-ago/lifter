import * as fs from "fs";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {LocalFileResponderEntity} from "../../local-file-responder/local-file-responder-entity";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";

export type AutoResponderEntryType = "File" | "Directory" | "Glob";

export interface AutoResponderEntryInterface {
    type: AutoResponderEntryType;
    pattern: AutoResponderEntryPattern;
    path: AutoResponderEntryPath;

    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null>;
    getMatchStats(path: ClientRequestUrl): Promise<fs.Stats>;
}
