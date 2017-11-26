"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promisify = require("es6-promisify");
const Datastore = require("nedb");
class AsyncOnNedbFactory {
    constructor(dataStoreOptions) {
        this.identity = 0;
        this.timeout = 0;
        this.keyName = "currentCount";
        this.datastore = new Datastore(dataStoreOptions);
        this.find = promisify(this.datastore.find, this.datastore);
        this.update = promisify(this.datastore.update, this.datastore);
        this.loadDatabase = promisify(this.datastore.loadDatabase, this.datastore);
    }
    async load() {
        await this.loadDatabase();
        let line = await this.find({ name: this.keyName });
        if (line.length) {
            this.identity = line.shift()["count"];
            return;
        }
        return this.upsertCurrentId();
    }
    getNextIdNumber() {
        this.upsertCurrentId();
        return this.identity++;
    }
    upsertCurrentId() {
        if (this.timeout) return;
        this.timeout = setTimeout(() => {
            this.timeout = 0;
            // ignore returned promise
            return this.update(
                { name: this.keyName },
                {
                    name: this.keyName,
                    count: this.identity
                },
                { upsert: true }
            );
        });
    }
}
exports.AsyncOnNedbFactory = AsyncOnNedbFactory;
