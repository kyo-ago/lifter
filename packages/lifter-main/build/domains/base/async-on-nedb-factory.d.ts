/// <reference types="nedb" />
import Datastore = require("nedb");
export abstract class AsyncOnNedbFactory {
    private datastore;
    private identity;
    private timeout;
    private keyName;
    private find;
    private update;
    private loadDatabase;
    constructor(dataStoreOptions: Datastore.DataStoreOptions);
    load(): Promise<void>;
    protected getNextIdNumber(): number;
    private upsertCurrentId();
}
