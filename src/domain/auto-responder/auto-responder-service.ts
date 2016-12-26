import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"

import {AutoResponderEntryRepository} from "../auto-responder-entry/auto-responder-entry-repository";
import {AutoResponderSettingFileRepository} from "../auto-responder-setting-file/auto-responder-setting-file-repository";

export class AutoResponderService {
    repository = new AutoResponderEntryRepository();
    private autoResponderSettingFileRepository = new AutoResponderSettingFileRepository();

    bind(win: Window) {
        let subject = new Rx.Subject<DragEvent>();
        win.addEventListener("drop", (e) => subject.next(e));
        subject.asObservable().subscribe((e) => {
            let files = Array.from(e.dataTransfer.files);
            if (files.length === 1 && files[0].name === '') {
                return this.autoResponderSettingFileRepository.storeFilesList(files);
            }
            this.repository.storeFilesList(files);
        });

        return this.repository.observer;
    }
}