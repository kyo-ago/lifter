import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"
import * as Datastore from "nedb";

import {AutoResponderEntryRepository} from "../auto-responder-entry/auto-responder-entry-repository";
import {AutoResponderSettingFileRepository} from "../auto-responder-setting-file/auto-responder-setting-file-repository";
import {SETTING_FILE_NAME} from "../settings";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";

export class AutoResponderService {
    private autoResponderEntryRepository: AutoResponderEntryRepository;
    private autoResponderSettingFileRepository: AutoResponderSettingFileRepository;

    constructor(private datastore: Datastore) {
        this.autoResponderEntryRepository = new AutoResponderEntryRepository(this.datastore);
        this.autoResponderSettingFileRepository = new AutoResponderSettingFileRepository(this.datastore);
    }

    createSubject() {
        let subject = new Rx.Subject<File[]>();
        subject.asObservable().subscribe((files) => {
            files.forEach((file) => {
                this.storeFile(file);
            });
        });
        return subject;
    }

    getObserver() {
        return this.autoResponderEntryRepository.observer;
    }

    findMatchEntry(clientRequestPathname: ClientRequestUrl) {
        return this.autoResponderEntryRepository.findMatchEntry(clientRequestPathname);
    }

    loadFile() {
        this.autoResponderSettingFileRepository.loadFile();
    }

    private storeFile(file: File) {
        if (file.name !== SETTING_FILE_NAME) {
            this.autoResponderEntryRepository.storeFile(file);
            return;
        }
        let entity = this.autoResponderSettingFileRepository.storeFile(file);
        entity.autoResponderEntries.forEach((entrie) => {
            this.autoResponderEntryRepository.store(entrie);
        });
    }
}