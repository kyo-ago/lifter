import { injectable } from "inversify";
import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../../project/project-entity";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderIdentity } from "../auto-responder-identity";
import { AutoResponderFactory } from "./auto-responder-factory";

@injectable()
export class AutoResponderRepository extends AsyncOnNedbRepository<
    AutoResponderIdentity,
    AutoResponderEntity
> {
    constructor(projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions(AutoResponderRepository.name), {
            toEntity: (json: any): AutoResponderEntity => {
                return AutoResponderFactory.fromJSON(json);
            },
            toJSON: (entity: AutoResponderEntity): any => {
                return entity.json;
            },
        });
    }
}
