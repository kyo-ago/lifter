import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"
import {OnMemoryRepository} from "typescript-dddbase";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileFactory} from "./auto-responder-setting-file-factory";
import {AutoResponderBoxEntry} from "../../ui/components/auto-responder-box";

export class AutoResponderSettingFileRepository extends OnMemoryRepository<AutoResponderSettingFileIdentity, AutoResponderSettingFileEntity> {
    public observer: Rx.Observable<AutoResponderBoxEntry>;
    private subject: Rx.Subject<AutoResponderBoxEntry>;

    constructor() {
        super();
        this.subject = new Rx.Subject<AutoResponderBoxEntry>();
        this.observer = this.subject.asObservable();
    }

    storeFilesList(files: File[]) {
        files.forEach((file) => {
            AutoResponderSettingFileFactory.createFromFile(file).then((entity) => {
                this.store(entity);
            });
        });
    }
}
