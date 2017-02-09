import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"
import * as Datastore from "nedb";

import {AutoResponderEntryBaseRepository} from "./entry/base/auto-responder-entry-base-repository";
import {AutoResponderSettingFileRepository} from "./setting-file/auto-responder-setting-file-repository";
import {SETTING_FILE_NAME} from "../settings";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";

export class AutoResponderService {
    private autoResponderEntryBaseRepository: AutoResponderEntryBaseRepository;
    private autoResponderSettingFileRepository: AutoResponderSettingFileRepository;

    constructor(private datastore: Datastore) {
        this.autoResponderEntryBaseRepository = new AutoResponderEntryBaseRepository(this.datastore);
        this.autoResponderSettingFileRepository = new AutoResponderSettingFileRepository(this.datastore);
    }

    createSubject() {
        let subject = new Rx.Subject<File[]>();
        subject.asObservable().subscribe((files) => {
            if (files.length === 1 && files[0].name === SETTING_FILE_NAME) {
                this.autoResponderSettingFileRepository.storeFile(files[0], this.autoResponderEntryBaseRepository);
                return;
            }
            files.forEach((file) => {
                this.autoResponderEntryBaseRepository.storeFile(file);
            });
        });
        return subject;
    }

    addAutoResponderEntryRepositoryPath(paths: string[]) {
        if (!paths) {
            return;
        }
        paths.forEach((path) => {
            this.autoResponderEntryBaseRepository.storePath(path);
        });
    }

    getObserver() {
        return this.autoResponderEntryBaseRepository.observer;
    }

    findMatchEntry(clientRequestPathname: ClientRequestUrl) {
        return this.autoResponderEntryBaseRepository.findMatchEntry(clientRequestPathname);
    }

    loadFile() {
        this.autoResponderSettingFileRepository.loadFile();
    }
}