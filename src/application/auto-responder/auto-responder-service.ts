import {AutoResponderEntryFactory} from "../../domain/auto-responder-entry/auto-responder-entry-factory";
import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/auto-responder-entry-repositoty";
import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";

export class AutoResponderService {
    constructor(
        private autoResponderEntryFactory: AutoResponderEntryFactory,
        private autoResponderEntryRepository: AutoResponderEntryRepository,
    ) {}

    addFiles(files: File[]) {
        let filePromises = files.map((file) => this.autoResponderEntryFactory.createFromFile(file));
        return Promise.all(filePromises).then((autoResponderEntryEntities) => {
            this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            return autoResponderEntryEntities;
        });
    }

    addPaths(paths: string[]) {
        let filePromises = paths.map((path) => this.autoResponderEntryFactory.createFromPath(path));
        return Promise.all(filePromises).then((autoResponderEntryEntities) => {
            this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            return autoResponderEntryEntities;
        });
    }
}
