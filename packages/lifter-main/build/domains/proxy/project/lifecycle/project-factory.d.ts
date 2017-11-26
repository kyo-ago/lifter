import { ProjectEntity } from "../project-entity";
export declare class ProjectFactory {
    private identity;
    static fromJSON(json: any): ProjectEntity;
    create(projectBaseDir: string): ProjectEntity;
}
