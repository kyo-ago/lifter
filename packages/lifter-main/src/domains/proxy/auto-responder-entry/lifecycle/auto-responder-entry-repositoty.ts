import { EventEmitter } from "events";
import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { LocalFileResponderFactory } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { LocalFileResponderEntity } from "../../local-file-responder/local-file-responder-entity";
import { ProjectEntity } from "../../project/project-entity";
import { AbstractAutoResponderEntryEntity, AutoResponderEntryEntity } from "../auto-responder-entry-entity";
import { AutoResponderEntryIdentity } from "../auto-responder-entry-identity";
import { FindMatchEntry } from "../specs/find-match-entry";
import { AutoResponderEntryPath } from "../value-objects/auto-responder-entry-path";
import { AutoResponderEntryPattern } from "../value-objects/auto-responder-entry-pattern";
import { AutoResponderEntryFactory } from "./auto-responder-entry-factory";

export class AutoResponderEntryRepository extends AsyncOnNedbRepository<
    AutoResponderEntryIdentity,
    AbstractAutoResponderEntryEntity
> {
    private event = new EventEmitter();

    constructor(projectEntity: ProjectEntity, private localFileResponderFactory: LocalFileResponderFactory) {
        super(projectEntity.getDataStoreOptions("autoResponderEntryRepository"), {
            toEntity: (json: any): AbstractAutoResponderEntryEntity => {
                return AutoResponderEntryFactory.fromJSON(json);
            },
            toJSON: (entity: AbstractAutoResponderEntryEntity): any => {
                return entity.json;
            }
        });
    }

    async findMatchEntry(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderEntity | null> {
        let findMatchEntry = new FindMatchEntry(this.localFileResponderFactory, clientRequestEntity);
        let entries = await this.resolveAll();
        return entries.reduce((promise, entity) => {
            return findMatchEntry.getLocalFileResponder(promise, entity);
        }, Promise.resolve(<LocalFileResponderEntity | null>null));
    }

    async load(): Promise<void> {
        let result = await super.load();
        this.event.emit("change");
        return result;
    }

    async store(entity: AutoResponderEntryEntity<AutoResponderEntryPattern, AutoResponderEntryPath>) {
        let result = await super.store(entity);
        this.event.emit("change");
        return result;
    }

    async deleteByIdentity(identity: AutoResponderEntryIdentity) {
        let result = await super.deleteByIdentity(identity);
        this.event.emit("change");
        return result;
    }

    addChangeEvent(callback: () => void) {
        this.event.addListener("change", callback);
    }
}
