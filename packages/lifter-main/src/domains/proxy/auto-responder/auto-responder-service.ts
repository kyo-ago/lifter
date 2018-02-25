import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import { AutoResponderIdentity } from "./auto-responder-identity";
import { AutoResponderFactory } from "./lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "./lifecycle/auto-responder-repositoty";

export class AutoResponderService {
    constructor(
        private autoResponderFactory: AutoResponderFactory,
        private autoResponderRepository: AutoResponderRepository,
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
