import {AutoResponderEntryFactory} from "../../../../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import {AutoResponderEntryRepository} from "../../../../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";

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
