import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import * as Rx from "rxjs/Rx";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { AbstractAutoResponderEntity } from "./auto-responder-entity";
import { AutoResponderIdentity } from "./auto-responder-identity";
import { AutoResponderFactory } from "./lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "./lifecycle/auto-responder-repositoty";
import { FindMatchEntry } from "./specs/find-match-entry";

export class AutoResponderService {
    public observable: Rx.Subject<void> = new Rx.Subject();

    constructor(
        private autoResponderFactory: AutoResponderFactory,
        private autoResponderRepository: AutoResponderRepository,
        private findMatchEntry: FindMatchEntry,
    ) {}

    async store(paths: string[]): Promise<AutoResponderEntityJSON[]> {
        let filePromises = paths.map(path => this.autoResponderFactory.createFromPath(path));
        let autoResponderEntities = await Promise.all(filePromises);
        await this.autoResponderRepository.storeList(autoResponderEntities);
        this.observable.next();
        return autoResponderEntities.map(autoResponderEntity => autoResponderEntity.json);
    }

    fetchAll(): Promise<AbstractAutoResponderEntity[]> {
        return this.autoResponderRepository.resolveAll();
    }

    async fetchAllJSONs(): Promise<AutoResponderEntityJSON[]> {
        let autoResponderEntities = await this.fetchAll();
        return autoResponderEntities.map(autoResponderEntity => autoResponderEntity.json);
    }

    async find(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponseEntity | null> {
        let entries = await this.autoResponderRepository.resolveAll();
        return entries.reduce((promise, entity) => {
            return this.findMatchEntry.getLocalFileResponse(promise, clientRequestEntity, entity);
        }, Promise.resolve(<LocalFileResponseEntity | null>null));
    }

    async delete(ids: number[]): Promise<void> {
        await Promise.all(
            ids.map(id => new AutoResponderIdentity(id)).map(autoResponderIdentity => {
                return this.autoResponderRepository.deleteByIdentity(autoResponderIdentity);
            }),
        );
        this.observable.next();
    }
}
