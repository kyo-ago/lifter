import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../../project/project-entity";
import { AbstractAutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderIdentity } from "../auto-responder-identity";
import { AutoResponderFactory } from "./auto-responder-factory";

export class AutoResponderRepository extends AsyncOnNedbRepository<AutoResponderIdentity, AbstractAutoResponderEntity> {
    constructor(projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions("autoResponderRepository"), {
            toEntity: (json: any): AbstractAutoResponderEntity => {
                return AutoResponderFactory.fromJSON(json);
            },
            toJSON: (entity: AbstractAutoResponderEntity): any => {
                return entity.json;
            },
        });
    }
}
