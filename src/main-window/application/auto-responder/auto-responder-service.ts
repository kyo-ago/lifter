import {AutoResponderEntryFactory} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";

export class AutoResponderService {
    constructor(
        private autoResponderEntryFactory: AutoResponderEntryFactory,
        private autoResponderEntryRepository: AutoResponderEntryRepository,
    ) {}

    async addFiles(files: File[]) {
        let filePromises = files.map((file) => this.autoResponderEntryFactory.createFromFile(file));
        let autoResponderEntryEntities = await Promise.all(filePromises);
        this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
        return autoResponderEntryEntities;
    }

    async addPaths(paths: string[]) {
        let filePromises = paths.map((path) => this.autoResponderEntryFactory.createFromPath(path));
        let autoResponderEntryEntities = await Promise.all(filePromises);
        this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
        return autoResponderEntryEntities;
    }
}
