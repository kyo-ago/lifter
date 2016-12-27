import * as Datastore from "nedb";

import {AsyncOnNedbRepository} from "../base/async-on-nedb-repository";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileFactory} from "./auto-responder-setting-file-factory";

export class AutoResponderSettingFileRepository extends AsyncOnNedbRepository<AutoResponderSettingFileIdentity, AutoResponderSettingFileEntity> {
    constructor(datastore: Datastore) {
        super(datastore, {
            toEntity(json: any): AutoResponderSettingFileEntity {
                return this.createFromPath(json['path'], parseInt(json['id'], 10));
            },
            toJSON(entity: AutoResponderSettingFileEntity): Object {
                return {
                    id: entity.id,
                    path: entity.path,
                };
            },
        });
    }

    storeFile(file: File): AutoResponderSettingFileEntity {
        let entity = AutoResponderSettingFileFactory.createFromFile(file);
        this.store(entity);
        return entity;
    }
}
