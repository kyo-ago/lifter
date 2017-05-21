import * as Rx from "@reactivex/rxjs/dist/cjs/Rx";

import {AutoResponderEntryFactory} from "../../domain/auto-responder-entry/auto-responder-entry-factory";
import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/auto-responder-entry-repositoty";

export interface AutoResponderBoxEntry {
    id: number;
    pattern: string;
    path: string;
    type: string;
}

export class AutoResponder extends Rx.Subject<null> {
    constructor(
        private autoResponderEntryFactory: AutoResponderEntryFactory,
        private autoResponderEntryRepository: AutoResponderEntryRepository,
    ) {
        super();
    }

    addFiles(files: File[]) {
        let filePromises = files.map((file) => this.autoResponderEntryFactory.createFromFile(file));
        return Promise.all(filePromises).then((autoResponderEntryEntities) => {
            this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            this.next();
        });
    }

    addPaths(paths: string[]) {
        let filePromises = paths.map((path) => this.autoResponderEntryFactory.createFromPath(path));
        return Promise.all(filePromises).then((autoResponderEntryEntities) => {
            this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            this.next();
        });
    }

    getAutoResponderBoxEntries(): AutoResponderBoxEntry[] {
        return this.autoResponderEntryRepository.getEntities().map((entity) => {
            return <AutoResponderBoxEntry>{
                id: entity.id,
                pattern: entity.pattern.value,
                path: entity.path.value,
                type: entity.type,
            };
        });
    }
}
