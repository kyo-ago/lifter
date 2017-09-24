import * as mime from 'mime';
import {BaseEntity} from '../../share/base/base-entity';
import {ClientRequestEntity} from '../client-request/client-request-entity';
import {LocalFileResponderParam} from '../local-file-responder/lifecycle/local-file-responder-factory';
import {ProjectIdentity} from '../project/project-identity';
import {AutoResponderEntryFilePath} from './auto-responder-entry-file/value-objects/auto-responder-entry-file-path';
import {AutoResponderEntryIdentity} from './auto-responder-entry-identity';
import {AutoResponderEntryPath} from './value-objects/auto-responder-entry-path';
import {AutoResponderEntryPattern} from './value-objects/auto-responder-entry-pattern';

export type AutoResponderEntryType = "File" | "Directory" | "Glob";

export type AbstractAutoResponderEntryEntity = AutoResponderEntryEntity<AutoResponderEntryPattern, AutoResponderEntryPath>;

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

    get json(): AutoResponderEntryEntityJSON {
        return {
            id: this.id,
            type: this.type,
            pattern: this.pattern.value,
            path: this.path.value,
            projectId: this.projectIdentity.getValue(),
        };
    }

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
            type: mime.getType(filePath.value),
            size: stats.size,
        };
    }
}
