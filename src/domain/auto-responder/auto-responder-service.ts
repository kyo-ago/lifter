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
            files.forEach((file) => {
                this.storeFile(file);
            });
        });
        return subject;
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

    private storeFile(file: File) {
        if (file.name !== SETTING_FILE_NAME) {
            this.autoResponderEntryBaseRepository.storeFile(file);
            return;
        }
        let entity = this.autoResponderSettingFileRepository.storeFile(file, this.autoResponderEntryBaseRepository);
    }
}