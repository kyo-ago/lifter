import { ProjectEntity } from "../proxy/project/project-entity";
export interface UserSettings {
    noGrant: boolean;
    noProxy: boolean;
}
export declare class UserSettingStorage {
    private datastore;
    private userSettings;
    private find;
    private update;
    private remove;
    private loadDatabase;
    constructor(projectEntity: ProjectEntity);
    load(): Promise<void>;
    resolve<S extends keyof UserSettings>(name: S): UserSettings[S];
    store<S extends keyof UserSettings>(name: S, value: UserSettings[S]): Promise<UserSettings[S]>;
    delete<S extends keyof UserSettings>(name: S): Promise<void>;
}
