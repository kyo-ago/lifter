import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryBaseFactory} from "../entry/base/auto-responder-entry-base-factory";
import {AutoResponderEntryGlobIdentity} from "../entry/glob/auto-responder-entry-glob-identity";
import {AutoResponderEntryGlobFactory} from "../entry/glob/auto-responder-entry-glob-factory";
import {AutoResponderEntryBaseRepository} from "../entry/base/auto-responder-entry-base-repository";

interface SettingFileFormat {
    responder: {
        pattern: string;
        path: string;
    }[];
}

export interface AutoResponderSettingFileParam {
    id?: number;
    path: string;
    autoResponderEntyIds: number[];
}

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static create(param: AutoResponderSettingFileParam): AutoResponderSettingFileEntity {
        return new AutoResponderSettingFileEntity(
            new AutoResponderSettingFileIdentity(param.id || ++this.identity),
            new AutoResponderSettingFilePath(param.path),
            param.autoResponderEntyIds.map((id) => new AutoResponderEntryGlobIdentity(id)),
        );
    }

    static createFromPath(path: string, identity: number = this.identity++): AutoResponderSettingFileEntity {
        let settings: SettingFileFormat = require(path);
        let autoResponderEntryEntities = settings.responder.map((res) => {
            return AutoResponderEntryGlobFactory.create({
                pattern: res.pattern,
                path: res.path,
            });
        });
        return new AutoResponderSettingFileEntity(
            new AutoResponderSettingFileIdentity(identity),
            new AutoResponderSettingFilePath(path),
            autoResponderEntryEntities.map((entity) => entity.id),
        );
    }

    static createFromFile(file: File, autoResponderEntryBaseRepository: AutoResponderEntryBaseRepository): AutoResponderSettingFileEntity {
        let settings: SettingFileFormat = require(file.path);
        let autoResponderEntryEntities = settings.responder.map((res) => {
            let autoResponderEntryGlobFactory =  AutoResponderEntryGlobFactory.create({
                pattern: res.pattern,
                path: res.path,
            });
            autoResponderEntryBaseRepository.store(autoResponderEntryGlobFactory)
            return autoResponderEntryGlobFactory;
        });
        return new AutoResponderSettingFileEntity(
            new AutoResponderSettingFileIdentity(++this.identity),
            new AutoResponderSettingFilePath(file.path),
            autoResponderEntryEntities.map((entity) => entity.id),
        );
    }
}