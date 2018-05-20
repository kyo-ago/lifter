import { injectable } from "inversify";
import * as Datastore from "nedb";
import { promisify } from "util";
import { ProjectEntity } from "../../proxy/project/project-entity";

export interface UserSettings {
    autoEnableProxy: boolean;
    pacFileProxy: boolean;
}

const DefaultUserSettings: UserSettings = {
    autoEnableProxy: true,
    pacFileProxy: true,
};

@injectable()
export class UserSettingsStorage {
    private userSettings: UserSettings = DefaultUserSettings;

    private readonly datastore: Datastore;
    private readonly find: (query: any) => Promise<any[]>;
    private readonly update: (
        query: any,
        value: any,
        option: any,
    ) => Promise<any>;
    private readonly loadDatabase: () => Promise<void>;

    constructor(projectEntity: ProjectEntity) {
        let dataStoreOptions = projectEntity.getDataStoreOptions(
            UserSettingsStorage.name,
        );
        this.datastore = new Datastore(dataStoreOptions);

        this.find = promisify(this.datastore.find.bind(this.datastore));
        this.update = promisify(this.datastore.update.bind(this.datastore));
        this.loadDatabase = promisify(
            this.datastore.loadDatabase.bind(this.datastore),
        );
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

    toggle<S extends keyof UserSettings>(name: S): Promise<UserSettings[S]> {
        return this.store(name, !this.userSettings[name]);
    }

    private async store<S extends keyof UserSettings>(
        name: S,
        value: UserSettings[S],
    ): Promise<UserSettings[S]> {
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
}
