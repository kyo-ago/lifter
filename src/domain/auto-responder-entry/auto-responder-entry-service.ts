import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"

import {AutoResponderEntryRepository} from "./auto-responder-entry-repository";

export class AutoResponderEntryService {
    repository = new AutoResponderEntryRepository();

    initialize(win: Window) {
        let subject = new Rx.Subject<DragEvent>();
        win.addEventListener("drop", (e) => subject.next(e));
        subject.asObservable().subscribe((e) => {
            this.repository.storeFilesList(Array.from(e.dataTransfer.files));
        });

        return this.repository.observer;
    }
}