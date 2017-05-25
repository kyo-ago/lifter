import {ipcRenderer, remote} from 'electron';
import {AutoResponderEntryFactory} from '../../domain/auto-responder-entry/auto-responder-entry-factory';
import {AutoResponderEntryRepository} from '../../domain/auto-responder-entry/auto-responder-entry-repositoty';

export interface AutoResponderBoxEntry {
    id: number;
    pattern: string;
    path: string;
    type: string;
}

export class AutoResponder {
    constructor(
        private autoResponderEntryFactory: AutoResponderEntryFactory,
        private autoResponderEntryRepository: AutoResponderEntryRepository,
    ) {}

    bind(
        global: Window,
        updater: () => void,
    ) {
        global.addEventListener("drop", (e) => {
            if (!e.dataTransfer || !e.dataTransfer.files.length) {
                return;
            }
            this.addFiles(Array.from(e.dataTransfer.files));
            updater();
        });
        ipcRenderer.on("addAutoResponderEntry", () => {
            remote.dialog.showOpenDialog(null, {
                properties: ['openDirectory', 'openFile', 'createDirectory'],
            }, (filePaths) => {
                this.addPaths(filePaths);
                updater();
            });
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

    private addFiles(files: File[]) {
        let filePromises = files.map((file) => this.autoResponderEntryFactory.createFromFile(file));
        return Promise.all(filePromises).then((autoResponderEntryEntities) => {
            this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
        });
    }

    private addPaths(paths: string[]) {
        let filePromises = paths.map((path) => this.autoResponderEntryFactory.createFromPath(path));
        return Promise.all(filePromises).then((autoResponderEntryEntities) => {
            this.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
        });
    }
}
