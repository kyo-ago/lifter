import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseParam } from "../local-file-response/lifecycle/local-file-response-factory";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { AbstractAutoResponderEntity } from "./auto-responder-entity";
import { AutoResponderIdentity } from "./auto-responder-identity";
import { AutoResponderFactory } from "./lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "./lifecycle/auto-responder-repositoty";
import { FindMatchEntry } from "./specs/find-match-entry";

export class AutoResponderService {
    constructor(
        private autoResponderFactory: AutoResponderFactory,
        private autoResponderRepository: AutoResponderRepository,
        private findMatchEntry: FindMatchEntry,
    ) {}
    private callbacks: (() => void)[] = [];

    async add(filePaths: string[]): Promise<AutoResponderEntityJSON[]> {
        let filePromises = filePaths.map(path =>
            this.autoResponderFactory.createFromPath(path),
        );
        let autoResponderEntities = await Promise.all(filePromises);
        await this.autoResponderRepository.storeList(autoResponderEntities);
        this.fire();
        return autoResponderEntities.map((autoResponderEntity) => autoResponderEntity.json);
    }

    fetch(): Promise<AbstractAutoResponderEntity[]> {
        return this.autoResponderRepository.resolveAll();
    }

    async fetchJSONs(): Promise<AutoResponderEntityJSON[]> {
        let autoResponderEntities = await this.autoResponderRepository.resolveAll();
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
            ids
                .map((id) => new AutoResponderIdentity(id))
                .map((autoResponderIdentity) => {
                    return this.autoResponderRepository.deleteByIdentity(autoResponderIdentity);
                }),
        );
        this.fire();
    }

    subscribe(callback: () => void) {
        this.callbacks.push(callback);
    }

    private fire() {
        this.callbacks.forEach((callback) => callback());
    }
}
