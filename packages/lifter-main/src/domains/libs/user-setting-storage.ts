import * as Datastore from "nedb";
import { promisify } from "util";
import { ProjectEntity } from "../proxy/project/project-entity";

export interface UserSettings {
    noAutoEnableProxy: boolean;
    noPacFileProxy: boolean;
}
const DefaultUserSettings: UserSettings = {
    noAutoEnableProxy: false,
    noPacFileProxy: false,
};

export class UserSettingStorage {
    private datastore: Datastore;
    private userSettings: UserSettings = DefaultUserSettings;

    private find: (query: any) => Promise<any[]>;
    private update: (query: any, value: any, option: any) => Promise<any>;
    private remove: (query: any, option: any) => Promise<any>;
    private loadDatabase: () => Promise<void>;

    constructor(projectEntity: ProjectEntity) {
        let dataStoreOptions = projectEntity.getDataStoreOptions("userSettingStorage");
        this.datastore = new Datastore(dataStoreOptions);

        this.find = promisify(this.datastore.find.bind(this.datastore));
        this.update = promisify(this.datastore.update.bind(this.datastore));
        this.remove = promisify(this.datastore.remove.bind(this.datastore));
        this.loadDatabase = promisify(this.datastore.loadDatabase.bind(this.datastore));
    }

    async load(): Promise<void> {
        await this.loadDatabase();
        let line = await this.find({});
        this.userSettings = line.reduce((base, cur) => {
            base[cur.name] = cur.value;
            return base;
        }, this.userSettings);
    }

    resolve<S extends keyof UserSettings>(name: S): UserSettings[S] {
        return this.userSettings[name];
    }

    async store<S extends keyof UserSettings>(name: S, value: UserSettings[S]): Promise<UserSettings[S]> {
        await this.update(
            { name: name },
            {
                name: name,
                value: value,
            },
            { upsert: true },
        );
        this.userSettings[name] = value;
        return value;
    }

    async delete<S extends keyof UserSettings>(name: S) {
        await this.remove({ name: name }, {});
        this.userSettings[name] = DefaultUserSettings[name];
    }

    toggle<S extends keyof UserSettings>(name: S): Promise<UserSettings[S]> {
        return this.store(name, !this.userSettings[name]);
    }
}
