import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderFactory } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { LocalFileResponderEntity } from "../../local-file-responder/local-file-responder-entity";
import { ProjectEntity } from "../../project/project-entity";
import { AbstractAutoResponderEntryEntity, AutoResponderEntryEntity } from "../auto-responder-entry-entity";
import { AutoResponderEntryIdentity } from "../auto-responder-entry-identity";
import { AutoResponderEntryPath } from "../value-objects/auto-responder-entry-path";
import { AutoResponderEntryPattern } from "../value-objects/auto-responder-entry-pattern";
export declare class AutoResponderEntryRepository extends AsyncOnNedbRepository<
    AutoResponderEntryIdentity,
    AbstractAutoResponderEntryEntity
> {
    private localFileResponderFactory;
    private event;
    constructor(projectEntity: ProjectEntity, localFileResponderFactory: LocalFileResponderFactory);
    findMatchEntry(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderEntity | null>;
    load(): Promise<void>;
    store(
        entity: AutoResponderEntryEntity<AutoResponderEntryPattern, AutoResponderEntryPath>
    ): Promise<AutoResponderEntryEntity<AutoResponderEntryPattern, AutoResponderEntryPath>>;
    deleteByIdentity(
        identity: AutoResponderEntryIdentity
    ): Promise<
        AsyncOnNedbRepository<
            AutoResponderEntryIdentity,
            AutoResponderEntryEntity<AutoResponderEntryPattern, AutoResponderEntryPath>
        >
    >;
    addChangeEvent(callback: () => void): void;
}
