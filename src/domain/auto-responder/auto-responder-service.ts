import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"

import {AutoResponderEntryRepository} from "../auto-responder-entry/auto-responder-entry-repository";
import {AutoResponderSettingFileRepository} from "../auto-responder-setting-file/auto-responder-setting-file-repository";
import {SETTING_FILE_NAME} from "../settings";
import {ClientRequestUrl} from "../client-request/value-objects/client-request-url";

export class AutoResponderService {
    private autoResponderEntryRepository = new AutoResponderEntryRepository();
    private autoResponderSettingFileRepository = new AutoResponderSettingFileRepository();

    bind(win: Window) {
        let subject = new Rx.Subject<DragEvent>();
        win.addEventListener("drop", (e) => subject.next(e));
        subject.asObservable().subscribe((e) => {
            Array.from(e.dataTransfer.files).forEach((file) => {
                if (file.name !== SETTING_FILE_NAME) {
                    this.autoResponderEntryRepository.storeFile(file);
                    return;
                }
                let entity = this.autoResponderSettingFileRepository.storeFile(file);
                entity.autoResponderEntries.forEach((entrie) => {
                    this.autoResponderEntryRepository.store(entrie);
                });
            });
        });

        return this.autoResponderEntryRepository.observer;
    }

    findMatchEntry(clientRequestPathname: ClientRequestUrl) {
        return this.autoResponderEntryRepository.findMatchEntry(clientRequestPathname);
    }
}