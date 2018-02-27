import { EventEmitter } from "events";
import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../../project/project-entity";
import { AbstractAutoResponderEntity, AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderIdentity } from "../auto-responder-identity";
import { AutoResponderPath } from "../value-objects/auto-responder-path";
import { AutoResponderPattern } from "../value-objects/auto-responder-pattern";
import { AutoResponderFactory } from "./auto-responder-factory";

export class AutoResponderRepository extends AsyncOnNedbRepository<
    AutoResponderIdentity,
    AbstractAutoResponderEntity
> {
    private event = new EventEmitter();

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

    async load(): Promise<void> {
        let result = await super.load();
        this.event.emit("change");
        return result;
    }

    async store(entity: AutoResponderEntity<AutoResponderPattern, AutoResponderPath>) {
        let result = await super.store(entity);
        this.event.emit("change");
        return result;
    }

    async deleteByIdentity(identity: AutoResponderIdentity) {
        let result = await super.deleteByIdentity(identity);
        this.event.emit("change");
        return result;
    }

    addChangeEvent(callback: () => void) {
        this.event.addListener("change", callback);
    }
}
