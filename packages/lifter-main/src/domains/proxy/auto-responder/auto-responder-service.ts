import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponderEntity } from "../local-file-responder/local-file-responder-entity";
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

    async add(filePaths: string[]): Promise<AutoResponderEntityJSON[]> {
        let filePromises = filePaths.map(path =>
            this.autoResponderFactory.createFromPath(path),
        );
        let autoResponderEntities = await Promise.all(filePromises);
        await this.autoResponderRepository.storeList(autoResponderEntities);
        return autoResponderEntities.map((autoResponderEntity) => autoResponderEntity.json);
    }

    async fetch(): Promise<AutoResponderEntityJSON[]> {
        let autoResponderEntities = await this.autoResponderRepository.resolveAll();
        return autoResponderEntities.map(autoResponderEntity => autoResponderEntity.json);
    }

    async find(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderEntity | null> {
        let entries = await this.autoResponderRepository.resolveAll();
        return entries.reduce((promise, entity) => {
            return this.findMatchEntry.getLocalFileResponder(promise, clientRequestEntity, entity);
        }, Promise.resolve(<LocalFileResponderEntity | null>null));
    }

    async delete(ids: number[]): Promise<void> {
        await Promise.all(
            ids
                .map((id) => new AutoResponderIdentity(id))
                .map((autoResponderIdentity) => {
                    return this.autoResponderRepository.deleteByIdentity(autoResponderIdentity);
                }),
        );
    }
}
