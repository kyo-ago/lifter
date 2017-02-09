import * as Datastore from "nedb";

import {AsyncOnNedbRepository} from "../../base/async-on-nedb-repository";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileFactory} from "./auto-responder-setting-file-factory";
import {AutoResponderEntryBaseRepository} from "../entry/base/auto-responder-entry-base-repository";

export class AutoResponderSettingFileRepository extends AsyncOnNedbRepository<AutoResponderSettingFileIdentity, AutoResponderSettingFileEntity> {
    constructor(datastore: Datastore) {
        super(datastore, {
            toEntity(json: any): AutoResponderSettingFileEntity {
                return AutoResponderSettingFileFactory.create({
                    id: json.id,
                    path: json.path,
                    autoResponderEntyIds: json.autoResponderEntyIds,
                });
            },
            toJSON(entity: AutoResponderSettingFileEntity): Object {
                return {
                    id: entity.id,
                    path: entity.path,
                    autoResponderEntyIds: entity.autoResponderEntryGlobIdentity.map((id) => id.getValue()),
                };
            },
        });
    }

    storeFile(file: File, autoResponderEntryBaseRepository: AutoResponderEntryBaseRepository): AutoResponderSettingFileEntity {
        let entity = AutoResponderSettingFileFactory.createFromFile(file, autoResponderEntryBaseRepository);
        this.store(entity);
        return entity;
    }

    loadFile() {
        this.findAll().then((autoResponderSettingFileEntities: AutoResponderSettingFileEntity[]) => {
            autoResponderSettingFileEntities
        });
    }
}
