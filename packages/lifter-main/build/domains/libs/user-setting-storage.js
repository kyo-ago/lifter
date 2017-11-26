"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promisify = require("es6-promisify");
const Datastore = require("nedb");
const DefaultUserSettings = {
    noGrant: false,
    noProxy: false
};
class UserSettingStorage {
    constructor(projectEntity) {
        this.userSettings = DefaultUserSettings;
        let dataStoreOptions = projectEntity.getDataStoreOptions("userSettingStorage");
        this.datastore = new Datastore(dataStoreOptions);
        this.find = promisify(this.datastore.find, this.datastore);
        this.update = promisify(this.datastore.update, this.datastore);
        this.remove = promisify(this.datastore.remove, this.datastore);
        this.loadDatabase = promisify(this.datastore.loadDatabase, this.datastore);
    }
    async load() {
        await this.loadDatabase();
        let line = await this.find({});
        this.userSettings = line.reduce((base, cur) => {
            base[cur.name] = cur.value;
            return base;
        }, this.userSettings);
    }
    resolve(name) {
        return this.userSettings[name];
    }
    async store(name, value) {
        await this.update(
            { name: name },
            {
                name: name,
                value: value
            },
            { upsert: true }
        );
        this.userSettings[name] = value;
        return value;
    }
    async delete(name) {
        await this.remove({ name: name }, {});
        this.userSettings[name] = DefaultUserSettings[name];
    }
}
exports.UserSettingStorage = UserSettingStorage;
