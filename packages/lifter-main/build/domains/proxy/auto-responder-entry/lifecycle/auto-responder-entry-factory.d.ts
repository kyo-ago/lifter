import { AsyncOnNedbFactory } from "../../../base/async-on-nedb-factory";
import { ProjectEntity } from "../../project/project-entity";
import {
    AbstractAutoResponderEntryEntity,
    AutoResponderEntryEntityJSON,
    AutoResponderEntryType
} from "../auto-responder-entry-entity";
import { AutoResponderEntryFileEntity } from "../auto-responder-entry-file/auto-responder-entry-file-entity";
export declare class AutoResponderEntryFactory extends AsyncOnNedbFactory {
    private projectEntity;
    constructor(projectEntity: ProjectEntity);
    static fromJSON(autoResponderEntryEntityJSON: AutoResponderEntryEntityJSON): AutoResponderEntryFileEntity;
    create(type: AutoResponderEntryType, pattern: string, path: string): AbstractAutoResponderEntryEntity;
    createFromFile(file: File): Promise<AbstractAutoResponderEntryEntity>;
    createFromPath(path: string): Promise<AbstractAutoResponderEntryEntity>;
    private createFrom(pattern, path);
}
